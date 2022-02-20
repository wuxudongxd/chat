import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (user) {
      throw new Error('username already exists');
    }
    const newUser = await this.prisma.user.create({
      data: {
        username,
        password,
        avatar: '',
        tag: '',
        role: 'user',
      },
    });
    return newUser;
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new Error('Invalid username or password');
    }
    if (password !== user.password) {
      throw new Error('Invalid username or password');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;
    return {
      user: rest,
      token: this.jwtService.sign({ username }),
    };
  }
}
