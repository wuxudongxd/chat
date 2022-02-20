import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  imports: [PrismaModule],
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendModule {}
