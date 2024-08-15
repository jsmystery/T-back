import { categoryEditSelect } from 'src/resources/category/selects/category.select'
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
		},
	},
	category: {
		select: categoryEditSelect,
	},
}