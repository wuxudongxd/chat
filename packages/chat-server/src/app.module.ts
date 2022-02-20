import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from './modules/passport/passport.module';

@Module({
  imports: [AuthModule, PassportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
