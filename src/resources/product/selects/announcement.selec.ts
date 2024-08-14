import { nestedOrderSelect } from 'src/resources/order/selects/order.select'

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
	orders: {
		select: nestedOrderSelect,
	},
	views: true,
	createdAt: true,
}
