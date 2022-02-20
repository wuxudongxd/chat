import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { nameVerify, passwordVerify } from '../../common/utils';

import type { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(
    username: string,
    password: string,
  ): Promise<Pick<User, 'username' | 'password'>> {
    if (!nameVerify(username) || !passwordVerify(password)) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return { username, password };
  }
}
