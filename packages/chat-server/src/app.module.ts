import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from './modules/passport/passport.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { GroupModule } from './modules/group/group.module';
import { FriendModule } from './modules/friend/friend.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PassportModule,
    UserModule,
    GroupModule,
    FriendModule,
    ChatModule,
  ],
})
export class AppModule {}
