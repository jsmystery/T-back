import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { OrderResolver } from './order.resolver'
import { OrderService } from './order.service'
import { OrderEvent } from './order.event'

@Module({
	imports: [
		BullModule.forRoot({
			redis: {
				host: process.env.NOTICE_DOMAIN,
				port: +process.env.NOTICE_PORT,
				password: process.env.NOTICE_PASSWORD,
				maxRetriesPerRequest: null,
			},
		}),
		BullModule.registerQueue({
			name: 'order',
			defaultJobOptions: {
				attempts: 2,
			},
		}),
	],
	providers: [OrderResolver, OrderService, OrderEvent],
})
export class OrderModule {}
