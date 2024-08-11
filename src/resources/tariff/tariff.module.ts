import { Module } from '@nestjs/common';
import { TariffService } from './tariff.service';
import { TariffResolver } from './tariff.resolver';

@Module({
  providers: [TariffResolver, TariffService],
})
export class TariffModule {}
