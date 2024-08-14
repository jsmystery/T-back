import {
	type ICapturePayment,
	type ICreatePayment,
	YooCheckout,
} from '@a2seven/yoo-checkout'
import { BadRequestException, Injectable } from '@nestjs/common'
import { IS_PRODUCTION } from 'src/global/constants/global.constants'
import { PrismaService } from 'src/prisma/prisma.service'
import { PaymentStatusInput } from './entities/payment.entity'
import { YookassaPayment } from './entities/yookassa.entity'
import { YookassaInput } from './inputs/yookassa.input'

const yookassa = new YooCheckout({
	shopId: process.env.SHOP_ID,
	secretKey: process.env.PAYMENT_TOKEN,
})

@Injectable()
export class YookassaService {
	constructor(private readonly prisma: PrismaService) {}

	async balanceTopUp(userId: number, input: YookassaInput) {
		const createPayload: ICreatePayment = {
			amount: {
				value: `${input.amount}.00`,
				currency: 'RUB',
			},
			payment_method_data: {
				type: 'bank_card',
			},
			confirmation: {
				type: 'redirect',
				return_url: input.redirectUrl,
			},
			metadata: {
				userId: userId,
			},
		}

		try {
			const payment = await yookassa.createPayment(createPayload)

			return {
				paymentUrl: payment.confirmation.confirmation_url,
			} as YookassaPayment
		} catch (error) {
			if (!IS_PRODUCTION) console.log(error)

			throw new BadRequestException('Ошибка во время пополнения баланса.')
		}
	}

	async checkYookassaStatus(input: PaymentStatusInput) {
		if (input.event === 'payment.waiting_for_capture') {
			const capturePayload: ICapturePayment = {
				amount: {
					value: input.object.amount.value,
					currency: 'RUB',
				},
			}

			const payment = await yookassa.capturePayment(
				input.object.id,
				capturePayload
			)
			console.log(`Capturing: ${payment}`)
			return payment
		}

		if (input.event === 'payment.succeeded') {
			const user = await this.prisma.brand.findUnique({
				where: {
					userId: +input.object.metadata.userId,
				},
				select: {
					balance: true,
				},
			})

			const newBalance = user.balance + +input.object.amount.value

			await this.prisma.brand.update({
				where: {
					userId: +input.object.metadata.userId,
				},
				data: {
					balance: newBalance,
				},
			})

			console.log(`New Balance: ${newBalance}`)

			return true
		}

		return true
	}
}
