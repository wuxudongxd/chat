import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { createWriteStream } from 'fs';
import { join } from 'node:path';

import type { Server, Socket } from 'socket.io';

import type { User, Group } from '@prisma/client';

@WebSocketGateway()
export class ChatGateway {
  constructor() {
    this.defaultGroup = '默认聊天室';
  }

  @WebSocketServer()
  server: Server; // io

  // 默认群
  defaultGroup: string;

  // socket连接钩子
  async handleConnection(socket: Socket): Promise<string> {
    const userRoom = socket.handshake.query.userId;
    // 连接默认加入"默认聊天室"房间
    socket.join(this.defaultGroup);
    // 进来统计一下在线人数
    this.getActiveGroupUser();
    // 用户独有消息房间 根据userId
    if (userRoom) {
      socket.join(userRoom);
    }
    return '连接成功';
  }

  // socket断连钩子
  async handleDisconnect(): Promise<any> {
    this.getActiveGroupUser();
  }

  // 创建群组
  @SubscribeMessage('addGroup')
  async addGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: Group,
  ): Promise<RESPONSE> {
    const isUser = await this.userRepository.findOne({ userId: data.userId });
    if (isUser) {
      const isHaveGroup = await this.groupRepository.findOne({
        groupName: data.groupName,
      });
      if (isHaveGroup) {
        this.server.to(data.userId).emit('addGroup', {
          code: 'fail',
          msg: '该群名字已存在',
          data: isHaveGroup,
        });
        return;
      }
      if (!nameVerify(data.groupName)) {
        return;
      }
      data = await this.groupRepository.save(data);
      socket.join(data.groupId);
      const group = await this.groupUserRepository.save(data);
      this.server.to(group.groupId).emit('addGroup', {
        code: 'ok',
        msg: `成功创建群${data.groupName}`,
        data: group,
      });
      this.getActiveGroupUser();
    } else {
      this.server
        .to(data.userId)
        .emit('addGroup', { code: 'fail', msg: `你没资格创建群` });
    }
  }

  // 加入群组
  @SubscribeMessage('joinGroup')
  async joinGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    const isUser = await this.userRepository.findOne({ userId: data.userId });
    if (isUser) {
      const group = await this.groupRepository.findOne({
        groupId: data.groupId,
      });
      let userGroup = await this.groupUserRepository.findOne({
        groupId: group.groupId,
        userId: data.userId,
      });
      const user = await this.userRepository.findOne({ userId: data.userId });
      if (group && user) {
        if (!userGroup) {
          data.groupId = group.groupId;
          userGroup = await this.groupUserRepository.save(data);
        }
        socket.join(group.groupId);
        const res = { group: group, user: user };
        this.server.to(group.groupId).emit('joinGroup', {
          code: 'ok',
          msg: `${user.username}加入群${group.groupName}`,
          data: res,
        });
        this.getActiveGroupUser();
      } else {
        this.server
          .to(data.userId)
          .emit('joinGroup', { code: 'fail', msg: '进群失败', data: '' });
      }
    } else {
      this.server
        .to(data.userId)
        .emit('joinGroup', { code: 'fail', msg: '你没资格进群' });
    }
  }

  // 加入群组的socket连接
  @SubscribeMessage('joinGroupSocket')
  async joinGroupSocket(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    const group = await this.groupRepository.findOne({ groupId: data.groupId });
    const user = await this.userRepository.findOne({ userId: data.userId });
    if (group && user) {
      socket.join(group.groupId);
      const res = { group: group, user: user };
      this.server.to(group.groupId).emit('joinGroupSocket', {
        code: 'ok',
        msg: `${user.username}加入群${group.groupName}`,
        data: res,
      });
    } else {
      this.server.to(data.userId).emit('joinGroupSocket', {
        code: 'fail',
        msg: '进群失败',
        data: '',
      });
    }
  }

  // 发送群消息
  @SubscribeMessage('groupMessage')
  async sendGroupMessage(@MessageBody() data: any): Promise<any> {
    const isUser = await this.userRepository.findOne({ userId: data.userId });
    if (isUser) {
      const userany = await this.groupUserRepository.findOne({
        userId: data.userId,
        groupId: data.groupId,
      });
      if (!userany || !data.groupId) {
        this.server.to(data.userId).emit('groupMessage', {
          code: 'fail',
          msg: '群消息发送错误',
          data: '',
        });
        return;
      }
      if (data.messageType === 'image') {
        const randomName = `${Date.now()}$${data.userId}$${data.width}$${
          data.height
        }`;
        const stream = createWriteStream(join('public/static', randomName));
        stream.write(data.content);
        data.content = randomName;
      }
      data.time = new Date().valueOf(); // 使用服务端时间
      await this.groupMessageRepository.save(data);
      this.server
        .to(data.groupId)
        .emit('groupMessage', { code: 'ok', msg: '', data: data });
    } else {
      this.server
        .to(data.userId)
        .emit('groupMessage', { code: 'fail', msg: '你没资格发消息' });
    }
  }

  // 添加好友
  @SubscribeMessage('addFriend')
  async addFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    const isUser = await this.userRepository.findOne({ userId: data.userId });
    if (isUser) {
      if (data.friendId && data.userId) {
        if (data.userId === data.friendId) {
          this.server.to(data.userId).emit('addFriend', {
            code: 'fail',
            msg: '不能添加自己为好友',
            data: '',
          });
          return;
        }
        const relation1 = await this.friendRepository.findOne({
          userId: data.userId,
          friendId: data.friendId,
        });
        const relation2 = await this.friendRepository.findOne({
          userId: data.friendId,
          friendId: data.userId,
        });
        const roomId =
          data.userId > data.friendId
            ? data.userId + data.friendId
            : data.friendId + data.userId;

        if (relation1 || relation2) {
          this.server.to(data.userId).emit('addFriend', {
            code: 'fail',
            msg: '已经有该好友',
            data: data,
          });
          return;
        }

        const friend = await this.userRepository.findOne({
          userId: data.friendId,
        });
        const user = await this.userRepository.findOne({ userId: data.userId });
        if (!friend) {
          this.server.to(data.userId).emit('addFriend', {
            code: 'fail',
            msg: '该好友不存在',
            data: '',
          });
          return;
        }

        // 双方都添加好友 并存入数据库
        await this.friendRepository.save(data);
        const friendData = JSON.parse(JSON.stringify(data));
        const friendId = friendData.friendId;
        friendData.friendId = friendData.userId;
        friendData.userId = friendId;
        delete friendData._id;
        await this.friendRepository.save(friendData);
        socket.join(roomId);

        // 如果是删掉的好友重新加, 重新获取一遍私聊消息
        let messages = await getRepository(FriendMessage)
          .createQueryBuilder('friendMessage')
          .orderBy('friendMessage.time', 'DESC')
          .where(
            'friendMessage.userId = :userId AND friendMessage.friendId = :friendId',
            { userId: data.userId, friendId: data.friendId },
          )
          .orWhere(
            'friendMessage.userId = :friendId AND friendMessage.friendId = :userId',
            { userId: data.userId, friendId: data.friendId },
          )
          .take(30)
          .getMany();
        messages = messages.reverse();

        if (messages.length) {
          friend.messages = messages;

          user.messages = messages;
        }

        this.server.to(data.userId).emit('addFriend', {
          code: 'ok',
          msg: `添加好友${friend.username}成功`,
          data: friend,
        });
        this.server.to(data.friendId).emit('addFriend', {
          code: 'ok',
          msg: `${user.username}添加你为好友`,
          data: user,
        });
      }
    } else {
      this.server
        .to(data.userId)
        .emit('addFriend', { code: 'fail', msg: '你没资格加好友' });
    }
  }

  // 加入私聊的socket连接
  @SubscribeMessage('joinFriendSocket')
  async joinFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    if (data.friendId && data.userId) {
      const relation = await this.friendRepository.findOne({
        userId: data.userId,
        friendId: data.friendId,
      });
      const roomId =
        data.userId > data.friendId
          ? data.userId + data.friendId
          : data.friendId + data.userId;
      if (relation) {
        socket.join(roomId);
        this.server.to(data.userId).emit('joinFriendSocket', {
          code: 'ok',
          msg: '进入私聊socket成功',
          data: relation,
        });
      }
    }
  }

  // 发送私聊消息
  @SubscribeMessage('friendMessage')
  async friendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    const isUser = await this.userRepository.findOne({ userId: data.userId });
    if (isUser) {
      if (data.userId && data.friendId) {
        const roomId =
          data.userId > data.friendId
            ? data.userId + data.friendId
            : data.friendId + data.userId;
        if (data.messageType === 'image') {
          const randomName = `${Date.now()}$${roomId}$${data.width}$${
            data.height
          }`;
          const stream = createWriteStream(join('public/static', randomName));
          stream.write(data.content);
          data.content = randomName;
        }
        data.time = new Date().valueOf();
        await this.friendMessageRepository.save(data);
        this.server
          .to(roomId)
          .emit('friendMessage', { code: 'ok', msg: '', data });
      }
    } else {
      this.server.to(data.userId).emit('friendMessage', {
        code: 'fail',
        msg: '你没资格发消息',
        data,
      });
    }
  }

  // 获取所有群和好友数据
  @SubscribeMessage('chatData')
  async getAllData(
    @ConnectedSocket() socket: Socket,
    @MessageBody() user: User,
  ): Promise<any> {
    const isUser = await this.userRepository.findOne({
      userId: user.userId,
      password: user.password,
    });
    if (isUser) {
      let groupArr: GroupDto[] = [];
      let friendArr: FriendDto[] = [];
      const userGather: { [key: string]: User } = {};
      let userArr: FriendDto[] = [];

      const any: any[] = await this.groupUserRepository.find({
        userId: user.userId,
      });
      const friendMap: any[] = await this.friendRepository.find({
        userId: user.userId,
      });

      const groupPromise = any.map(async (item) => {
        return await this.groupRepository.findOne({ groupId: item.groupId });
      });
      const groupMessagePromise = any.map(async (item) => {
        let groupMessage = await getRepository(GroupMessage)
          .createQueryBuilder('groupMessage')
          .orderBy('groupMessage.time', 'DESC')
          .where('groupMessage.groupId = :id', { id: item.groupId })
          .take(30)
          .getMany();
        groupMessage = groupMessage.reverse();
        // 这里获取一下发消息的用户的用户信息
        for (const message of groupMessage) {
          if (!userGather[message.userId]) {
            userGather[message.userId] = await this.userRepository.findOne({
              userId: message.userId,
            });
          }
        }
        return groupMessage;
      });

      const friendPromise = friendMap.map(async (item) => {
        return await this.userRepository.findOne({
          where: { userId: item.friendId },
        });
      });
      const friendMessagePromise = friendMap.map(async (item) => {
        const messages = await getRepository(FriendMessage)
          .createQueryBuilder('friendMessage')
          .orderBy('friendMessage.time', 'DESC')
          .where(
            'friendMessage.userId = :userId AND friendMessage.friendId = :friendId',
            { userId: item.userId, friendId: item.friendId },
          )
          .orWhere(
            'friendMessage.userId = :friendId AND friendMessage.friendId = :userId',
            { userId: item.userId, friendId: item.friendId },
          )
          .take(30)
          .getMany();
        return messages.reverse();
      });

      const groups: GroupDto[] = await Promise.all(groupPromise);
      const groupsMessage: Array<any[]> = await Promise.all(
        groupMessagePromise,
      );
      groups.map((group, index) => {
        if (groupsMessage[index] && groupsMessage[index].length) {
          group.messages = groupsMessage[index];
        }
      });
      groupArr = groups;

      const friends: FriendDto[] = await Promise.all(friendPromise);
      const friendsMessage: Array<any[]> = await Promise.all(
        friendMessagePromise,
      );
      friends.map((friend, index) => {
        if (friendsMessage[index] && friendsMessage[index].length) {
          friend.messages = friendsMessage[index];
        }
      });
      friendArr = friends;
      userArr = [...Object.values(userGather), ...friendArr];

      this.server.to(user.userId).emit('chatData', {
        code: 'ok',
        msg: '获取聊天数据成功',
        data: {
          groupData: groupArr,
          friendData: friendArr,
          userData: userArr,
        },
      });
    }
  }

  // 退群
  @SubscribeMessage('exitGroup')
  async exitGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() any: any,
  ): Promise<any> {
    if (any.groupId === this.defaultGroup) {
      return this.server
        .to(any.userId)
        .emit('exitGroup', { code: 'fail', msg: '默认群不可退' });
    }
    const user = await this.userRepository.findOne({ userId: any.userId });
    const group = await this.groupRepository.findOne({
      groupId: any.groupId,
    });
    const map = await this.groupUserRepository.findOne({
      userId: any.userId,
      groupId: any.groupId,
    });
    if (user && group && map) {
      await this.groupUserRepository.remove(map);
      this.server
        .to(any.userId)
        .emit('exitGroup', { code: 'ok', msg: '退群成功', data: any });
      return this.getActiveGroupUser();
    }
    this.server
      .to(any.userId)
      .emit('exitGroup', { code: 'fail', msg: '退群失败' });
  }

  // 删好友
  @SubscribeMessage('exitFriend')
  async exitFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() any: any,
  ): Promise<any> {
    const user = await this.userRepository.findOne({ userId: any.userId });
    const friend = await this.userRepository.findOne({
      userId: any.friendId,
    });
    const map1 = await this.friendRepository.findOne({
      userId: any.userId,
      friendId: any.friendId,
    });
    const map2 = await this.friendRepository.findOne({
      userId: any.friendId,
      friendId: any.userId,
    });
    if (user && friend && map1 && map2) {
      await this.friendRepository.remove(map1);
      await this.friendRepository.remove(map2);
      return this.server.to(any.userId).emit('exitFriend', {
        code: 'ok',
        msg: '删好友成功',
        data: any,
      });
    }
    this.server
      .to(any.userId)
      .emit('exitFriend', { code: 'fail', msg: '删好友失败' });
  }

  // 获取在线用户
  async getActiveGroupUser() {
    // 从socket中找到连接人数
    let userIdArr = Object.values(this.server.engine.sockets).map((item) => {
      return item.request._query.userId;
    });
    // 数组去重
    userIdArr = Array.from(new Set(userIdArr));

    const activeGroupUserGather = {};
    for (const userId of userIdArr) {
      const userGroupArr = await this.groupUserRepository.find({
        userId: userId,
      });
      const user = await this.userRepository.findOne({ userId: userId });
      if (user && userGroupArr.length) {
        userGroupArr.map((item) => {
          if (!activeGroupUserGather[item.groupId]) {
            activeGroupUserGather[item.groupId] = {};
          }
          activeGroupUserGather[item.groupId][userId] = user;
        });
      }
    }

    this.server.to(this.defaultGroup).emit('activeGroupUser', {
      msg: 'activeGroupUser',
      data: activeGroupUserGather,
    });
  }
}
