import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports: [PrismaModule],
  providers: [ChatGateway],
})
export class ChatModule {}
