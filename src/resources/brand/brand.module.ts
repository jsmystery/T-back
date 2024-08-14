import { Module } from '@nestjs/common'
import { CategoryService } from '../category/category.service'
import { TariffService } from '../tariff/tariff.service'
import { BrandResolver } from './brand.resolver'
import { BrandService } from './brand.service'

@Module({
	providers: [BrandResolver, BrandService, CategoryService, TariffService],
})
export class BrandModule {}
