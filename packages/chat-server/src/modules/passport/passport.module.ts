import { Module } from '@nestjs/common';
import { PassportModule as passport } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [passport],
  providers: [JwtStrategy, LocalStrategy],
})
export class PassportModule {}

// passport module 向外提供 JwtAuthGuard、LocalAuthGuard
