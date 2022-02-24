import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../passport/local.guard';
import { AuthService } from './auth.service';

import type { Request } from 'express';

@Controller()
@UseGuards(LocalAuthGuard)
export class AuthController {
  constructor(private readonly authServer: AuthService) {}

  @Post('signup')
  async signup(@Req() req: Request) {
    const user = req.user as { username: string; password: string };

    return this.authServer.signup(user.username, user.password);
  }

  @Post('signin')
  async signin(@Req() req: Request) {
    const user = req.user as { username: string; password: string };

    return this.authServer.signin(user.username, user.password);
  }
}
