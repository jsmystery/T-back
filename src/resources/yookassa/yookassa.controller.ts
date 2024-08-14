import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { PaymentStatusInput } from './entities/payment.entity'
import { YookassaService } from './yookassa.service'

@Controller('payment')
export class YookassaController {
	constructor(private readonly yookassaService: YookassaService) {}

	@HttpCode(200)
	@Post('status')
	async getPaymentStatus(@Body() input: PaymentStatusInput) {
		return this.yookassaService.checkYookassaStatus(input)
	}
}
