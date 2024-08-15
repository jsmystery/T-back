import { nestedTariffSelect } from 'src/resources/tariff/selects/tariff.select'

export const nestedOrderSelect = {
	tariff: {
		select: nestedTariffSelect,
	},
	expirationAt: true,
}
