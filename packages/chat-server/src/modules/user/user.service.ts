import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { User, RESPONSE } from '../../../types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserInfo(userId: number): Promise<RESPONSE<User>> {
    try {
      if (userId) {
        const data = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = data;
        return { code: 'ok', msg: '获取用户信息成功', data: rest };
      }
    } catch (e) {
      return { code: 'error', msg: '获取用户信息失败', data: e };
    }
  }

  async getUser(userId: number): Promise<RESPONSE<User>> {
    try {
      if (userId) {
        const data = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        return { code: 'ok', msg: '获取用户成功', data };
      }
    } catch (e) {
      return { code: 'error', msg: '获取用户失败', data: e };
    }
  }

  async postUsers(userIds: string): Promise<RESPONSE<any>> {
    try {
      if (userIds) {
        const userIdArr = userIds.split(',');
        const userArr = [];
        for (const userId of userIdArr) {
          if (userId) {
            const data = await this.prisma.user.findUnique({
              where: { id: Number(userId) },
            });
            userArr.push(data);
          }
        }
        return { code: 'ok', msg: '获取用户信息成功', data: userArr };
      }
      return { code: 'fail', msg: '获取用户信息失败', data: null };
    } catch (e) {
      return { code: 'error', msg: '获取用户信息失败', data: e };
    }
  }

  async updateUserName(user: User): Promise<RESPONSE<any>> {
    try {
      const isHaveName = await this.prisma.user.findUnique({
        where: {
          username: user.username,
        },
      });
      if (isHaveName) {
        return { code: 'fail', msg: '用户名重复', data: '' };
      }
      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          username: 'Viola the Magnificent',
        },
      });
      return { code: 'ok', msg: '更新用户名成功', data: updateUser };
    } catch (e) {
      return { code: 'error', msg: '更新用户名失败', data: e };
    }
  }

  async updatePassword(user: User, password: string): Promise<RESPONSE<User>> {
    try {
      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: password,
        },
      });
      return { code: 'ok', msg: '更新用户名成功', data: updateUser };
    } catch (e) {
      return { code: 'ok', msg: '更新用户密码失败', data: e };
    }
  }
}
