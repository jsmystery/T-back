import { InjectQueue } from '@nestjs/bull'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { IS_PRODUCTION } from 'src/global/constants/global.constants'
import { PrismaService } from 'src/prisma/prisma.service'
import { dateFormat } from 'src/utils/formats/date-format.util'
import { NestedOrder } from './entities/order.entity'
import { OrderInput } from './inputs/order.input'

@Injectable()
export class OrderService {
	constructor(
		private readonly prisma: PrismaService,
		@InjectQueue('order') private readonly orderBull: Queue
	) {}

	async buyTariff(userId: number, { productId, tariffType }: OrderInput) {
		try {
			const tariff = await this.prisma.tariff.findUnique({
				where: {
					type: tariffType,
				},
				select: {
					id: true,
					price: true,
					duration: true,
				},
			})

			const brand = await this.prisma.brand.findUnique({
				where: {
					userId,
				},
				select: {
					balance: true,
				},
			})

			if (brand.balance < tariff.price)
				throw new BadRequestException('У вас нехватает средств.')

			let orderData = {}

			if (tariff.duration) {
				const expirationDate = new Date()
				const durationInDays = tariff.duration / (24 * 60 * 60)
				expirationDate.setDate(expirationDate.getDate() + durationInDays)

				orderData = {
					expirationAt: expirationDate,
				}
			}

			const order = await this.prisma.order.create({
				data: {
					...orderData,
					tariff: {
						connect: {
							id: tariff.id,
						},
					},
					product: {
						connect: {
							id: productId,
						},
					},
				},
			})

			const newBalance = brand.balance - tariff.price
			await this.prisma.brand.update({
				where: {
					userId,
				},
				data: {
					balance: newBalance,
				},
			})

			const now = new Date()
			const timeDifference = order.expirationAt.getTime() - now.getTime()
			const isLittleLeft = timeDifference < 24 * 60 * 60 * 1000

			await this.orderBull.add(
				'order',
				{
					orderId: order.id,
				},
				{ delay: tariff.duration * 1000, jobId: String(order.id) }
			)

			return {
				expirationDate: dateFormat(order.expirationAt, 'DD.MM HH:mm'),
				isLittleLeft,
				tariff: {
					type: tariffType,
				},
			} as NestedOrder
		} catch (error) {
			if (!IS_PRODUCTION) console.log(error)

			if (error.response.error === 'Bad Request') {
				throw new BadRequestException(error.response.message)
			} else {
				throw new BadRequestException('Произошла ошибка во время покупки.')
			}
		}
	}
}
