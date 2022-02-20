import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from './modules/passport/passport.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, PassportModule, UserModule],
})
export class AppModule {}
