import { nestedTariffSelect } from 'src/resources/tariff/selects/tariff.select'

export const announcementCardSelect = {
	id: true,
	name: true,
	posterPath: true,
	sku: true,
	prices: {
		select: {
			price: true,
		},
	},
	brand: {
		select: {
			city: true,
		},
	},
	tariffs: {
		select: nestedTariffSelect,
	},
	views: true,
	createdAt: true,
	visibility: true,
}
