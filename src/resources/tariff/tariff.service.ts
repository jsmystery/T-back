import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { tariffSelect } from './selects/tariff.select'
import { Tariff } from './entities/tariff.entity'

@Injectable()
export class TariffService {
	constructor(private readonly prisma: PrismaService) {}

	async getAll() {
		const tariffs = await this.prisma.tariff.findMany({
			select: tariffSelect,
		})

		return tariffs
	}
}
