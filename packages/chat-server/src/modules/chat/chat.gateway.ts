import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// import { createWriteStream } from 'node:fs';
// import { join } from 'node:path';

import type { Server, Socket } from 'socket.io';
import type { User, Group } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  io: Server; // io

  // 默认群
  defaultGroup: string;

  constructor(private readonly prisma: PrismaService) {
    this.defaultGroup = '默认聊天室';
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string,
  ): void {
    console.log('server received:', message);
    socket.volatile.to(this.defaultGroup).emit('message', message);
  }

  // socket连接钩子
  async handleConnection(socket: Socket): Promise<string> {
    const userRoom = socket.handshake.query.userId;
    // 连接默认加入"默认聊天室"房间
    socket.join(this.defaultGroup);
    // 进来统计一下在线人数
    // this.getActiveGroupUser();
    // 用户独有消息房间 根据userId
    if (userRoom) {
      socket.join(`user-${userRoom}`);
    }
    return '连接成功';
  }

  // socket断连钩子
  async handleDisconnect(): Promise<any> {
    // this.getActiveGroupUser();
  }

  // 创建群组
  @SubscribeMessage('addGroup')
  async addGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: Partial<any>,
  ) {
    try {
      const group = await this.prisma.group.create({
        data: {
          name: data.name,
          users: {
            connect: {
              id: data.userId,
            },
          },
        },
        include: {
          users: true,
          messages: true,
        },
      });
      socket.join(`group-${data.groupId}`);
      this.io.to(socket.id).emit('addGroup', group);
    } catch (error) {
      this.io.to(socket.id).emit('addGroup', '创建失败');
    }
  }

  // 加入群组
  @SubscribeMessage('joinGroup')
  async joinGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    const joinedGroup = await this.prisma.group.update({
      where: {
        id: data.groupId,
      },
      data: {
        users: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        users: true,
        messages: true,
      },
    });
    socket.join(`group-${data.groupId}`);
    this.io.to(socket.id).emit('joinGroup', joinedGroup);
  }

  // 发送群消息
  @SubscribeMessage('groupMessage')
  async sendGroupMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    console.log('sendGroupMessage', data);

    try {
      const message = await this.prisma.group_Message.create({
        data: {
          content: data.content,
          userId: data.userId,
          groupId: data.groupId,
        },
      });
      this.io.to(`group-${data.groupId}`).emit('groupMessage', message);
    } catch (error) {
      this.io.to(socket.id).emit('groupMessage', '发送失败');
    }
  }
  // 添加好友
  @SubscribeMessage('addFriend')
  async addFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    try {
      const { userId, friendId } = data;
      const relationId =
        userId < friendId
          ? `relation-${userId}-${friendId}`
          : `relation-${friendId}-${userId}`;
      await this.prisma.relation.create({
        data: {
          id: relationId,
          relation1Id: userId,
          relation2Id: friendId,
        },
      });
      socket.join(relationId);
      this.io.to(socket.id).emit('addFriend', '添加成功');
    } catch (error) {
      this.io.to(socket.id).emit('addFriend', '添加失败');
    }
  }

  // 加入私聊的socket连接
  @SubscribeMessage('joinFriendSocket')
  async joinFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    const { userId, friendId } = data;
    const relationId =
      userId < friendId
        ? `relation-${userId}-${friendId}`
        : `relation-${friendId}-${userId}`;
    socket.join(relationId);
    this.io.to(socket.id).emit('joinFriend', '加入成功');
  }

  // 发送私聊消息
  @SubscribeMessage('friendMessage')
  async friendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    try {
      const { userId, friendId, content } = data;
      const relationId =
        userId < friendId
          ? `relation-${userId}-${friendId}`
          : `relation-${friendId}-${userId}`;
      socket.join(relationId);
      await this.prisma.relation_Message.create({
        data: {
          relationId,
          content,
          speakerId: userId,
          listenerId: friendId,
        },
      });
    } catch (error) {
      this.io.to(socket.id).emit('friendMessage', '发送失败');
    }
  }

  // 获取所有群和好友数据
  @SubscribeMessage('chatData')
  async getAllData(
    @ConnectedSocket() socket: Socket,
    @MessageBody() user: User,
  ): Promise<any> {
    try {
      const groups = await this.prisma.group.findMany({
        where: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
        include: {
          users: true,
          messages: true,
        },
      });

      const friends = await this.prisma.relation.findMany({
        where: {
          OR: [
            {
              relation1Id: user.id,
            },
            {
              relation2Id: user.id,
            },
          ],
        },
      });
      const data = {
        groups,
        friends,
      };
      for (const group of groups) {
        socket.join(`group-${group.id}`);
      }
      this.io.to(socket.id).emit('chatData', data);
    } catch (error) {
      this.io.to(socket.id).emit('chatData', '获取失败');
    }
  }

  // 退群
  @SubscribeMessage('exitGroup')
  async exitGroup(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    try {
      const { userId, groupId } = data;
      if (groupId === this.defaultGroup) {
        this.io.to(socket.id).emit('exitGroup', '默认群不能退出');
        return;
      }
      socket.leave(groupId);
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          groups: {
            disconnect: { id: groupId },
          },
        },
      });
      this.io.to(socket.id).emit('exitGroup', groupId);
    } catch (error) {
      this.io.to(socket.id).emit('exitGroup', '退群失败');
    }
  }
  // 删好友
  @SubscribeMessage('exitFriend')
  async exitFriend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any,
  ): Promise<any> {
    try {
      const { userId, friendId } = data;
      const relationId =
        userId < friendId
          ? `relation-${userId}-${friendId}`
          : `relation-${friendId}-${userId}`;
      await this.prisma.relation.delete({
        where: {
          id: relationId,
        },
      });
      socket.leave(relationId);
      this.io.to(socket.id).emit('exitFriend', '删除好友成功');
    } catch (error) {
      this.io.to(socket.id).emit('exitFriend', '删除失败');
    }
  }
}
