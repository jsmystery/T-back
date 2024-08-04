import { Module } from '@nestjs/common';
import { TelegramAuthService } from './telegram-auth.service';
import { TelegramAuthResolver } from './telegram-auth.resolver';

@Module({
  providers: [TelegramAuthResolver, TelegramAuthService],
})
export class TelegramAuthModule {}
