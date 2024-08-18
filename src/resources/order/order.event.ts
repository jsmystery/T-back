import { Process, Processor } from '@nestjs/bull'
import type { Job } from 'bull'
import { PrismaService } from 'src/prisma/prisma.service'

@Processor('order')
export class OrderEvent {
	constructor(private readonly prisma: PrismaService) {}

	@Process('order')
	async expireOrder(job: Job) {
		const { orderId } = job.data

		await this.prisma.order.delete({
			where: {
				id: orderId,
			},
		})
	}
}
