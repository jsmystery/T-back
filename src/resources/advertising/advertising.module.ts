import { Module } from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import { AdvertisingResolver } from './advertising.resolver';

@Module({
  providers: [AdvertisingResolver, AdvertisingService],
})
export class AdvertisingModule {}
