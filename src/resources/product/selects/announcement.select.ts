import { categoryEditSelect } from 'src/resources/category/selects/category.select'
import { nestedOrderSelect } from 'src/resources/order/selects/order.select'

export const announcementCardSelect = {
	id: true,
	name: true,
	posterPath: true,
	sku: true,
	about: true,
	prices: {
		select: {
			price: true,
			minQuantity: true,
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
	rating: true,
	createdAt: true,
}

export const announcementSelect = {
	id: true,
	name: true,
	about: true,
	sku: true,
	posterPath: true,
	videoPath: true,
	imagesPaths: true,
	prices: {
		select: {
			price: true,
			minQuantity: true,
		},
	},
	category: {
		select: categoryEditSelect,
	},
}
