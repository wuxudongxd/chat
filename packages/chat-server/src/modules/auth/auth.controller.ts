import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../passport/local.guard';
import { AuthService } from './auth.service';

import type { Request } from 'express';

@Controller()
@UseGuards(LocalAuthGuard)
export class AuthController {
  constructor(private readonly authServer: AuthService) {}

  @Post('register')
  async register(@Req() req: Request) {
    const user = req.user as { username: string; password: string };

    return this.authServer.register(user.username, user.password);
  }

  @Post('login')
  async login(@Req() req: Request) {
    const user = req.user as { username: string; password: string };

    return this.authServer.login(user.username, user.password);
  }
}
