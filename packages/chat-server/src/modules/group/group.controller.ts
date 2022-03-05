import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../passport/jwt.guard';
import { GroupService } from './group.service';

@Controller('group')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('/findByName')
  getGroupsByName(@Query('groupName') groupName: string) {
    return this.groupService.getGroupsByName(groupName);
  }

  @Post()
  postGroups(@Body('groupIds') groupIds: string) {
    return this.groupService.postGroups(groupIds);
  }

  @Get('/userGroup')
  getUserGroups(@Query('userId') userId: string) {
    return this.groupService.getUserGroups(userId);
  }

  @Get('/groupUser')
  getGroupUsers(@Query('groupId') groupId: string) {
    return this.groupService.getGroupUsers(groupId);
  }

  @Get('/groupMessages')
  getGroupMessages(
    @Query('groupId') groupId: string,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.groupService.getGroupMessages(groupId, current, pageSize);
  }
}
