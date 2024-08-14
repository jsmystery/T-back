import { nestedTariffSelect } from 'src/resources/tariff/selects/tariff.select'

export const nestedOrderSelect = {
	duration: true,
	tariff: {
		select: nestedTariffSelect,
	},
	expirationAt: true,
}
