import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../passport/jwt.guard';
import { UserService } from './user.service';

import type { Request } from 'express';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUserInfo(@Req() req: Request) {
    const { id } = req.user as { id: number };
    return this.userService.getUserInfo(id);
  }

  // @Get()
  // getUsers(@Query('userId', ParseIntPipe) userId: number) {
  //   return this.userService.getUser(userId);
  // }

  @Post()
  postUsers(@Body('userIds') userIds: string) {
    return this.userService.postUsers(userIds);
  }

  @Patch('username')
  updateUserName(@Body() user) {
    return this.userService.updateUserName(user);
  }

  @Patch('password')
  updatePassword(@Body() user, @Query('password') password) {
    return this.userService.updatePassword(user, password);
  }
}
