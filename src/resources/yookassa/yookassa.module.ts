import { Module } from '@nestjs/common'
import { YookassaController } from './yookassa.controller'
import { YookassaResolver } from './yookassa.resolver'
import { YookassaService } from './yookassa.service'

@Module({
	controllers: [YookassaController],
	providers: [YookassaResolver, YookassaService],
})
export class YookassaModule {}
