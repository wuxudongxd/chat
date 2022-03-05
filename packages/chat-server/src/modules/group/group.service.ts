import { Injectable } from '@nestjs/common';
import { RESPONSE } from '../../../types';

import { PrismaService } from '../prisma/prisma.service';
import type { Group } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async getGroupsByName(groupName: string): Promise<RESPONSE<Group[]>> {
    try {
      if (groupName) {
        const groups = await this.prisma.group.findMany({
          where: {
            name: {
              contains: groupName,
            },
          },
        });
        return { code: 'ok', msg: '查找群成功', data: groups };
      }
      return { code: 'fail', msg: '请输入群昵称', data: null };
    } catch (e) {
      return { code: 'error', msg: '查找群错误', data: null };
    }
  }

  async postGroups(groupIds: string): Promise<RESPONSE<any>> {
    try {
      if (groupIds) {
        const groupIdArr = groupIds.split(',');
        const groupArr = [];
        for (const groupId of groupIdArr) {
          const data = await this.prisma.group.findUnique({
            where: { id: Number(groupId) },
          });
          groupArr.push(data);
        }
        return { code: 'ok', msg: '获取群信息成功', data: groupArr };
      }
      return { code: 'fail', msg: '获取群信息失败', data: null };
    } catch (e) {
      return { code: 'error', msg: '获取群失败', data: e };
    }
  }

  async getUserGroups(userId: string): Promise<RESPONSE<any>> {
    try {
      return { code: 'ok', msg: '获取系统所有群成功', data: '' };
    } catch (e) {
      return { code: 'error', msg: '获取用户的群失败', data: e };
    }
  }

  async getGroupUsers(groupId: string) {
    try {
      let data;
      if (groupId) {
        data = await this.prisma.group.findFirst({
          where: {
            id: Number(groupId),
          },
        });
        return { msg: '获取群的所有用户成功', data };
      }
    } catch (e) {
      return { msg: '获取群的用户失败', data: e };
    }
  }

  async getGroupMessages(groupId: string, current: number, pageSize: number) {
    // let groupMessage = await getRepository(GroupMessage)
    //   .createQueryBuilder('groupMessage')
    //   .orderBy('groupMessage.time', 'DESC')
    //   .where('groupMessage.groupId = :id', { id: groupId })
    //   .skip(current)
    //   .take(pageSize)
    //   .getMany();
    // groupMessage = groupMessage.reverse();

    const userGather: { [key: string]: any } = {};
    let userArr = [];
    // for (const message of groupMessage) {
    //   if (!userGather[message.userId]) {
    //     userGather[message.userId] = await getRepository(User)
    //       .createQueryBuilder('user')
    //       .where('user.userId = :id', { id: message.userId })
    //       .getOne();
    //   }
    // }
    userArr = Object.values(userGather);
    return { msg: '', data: { messageArr: 'groupMessage', userArr: userArr } };
  }
}
