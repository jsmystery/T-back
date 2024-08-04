import { brandNestedSelect } from 'src/resources/brand/selects/brand.select'
import { categoryNestedSelect } from 'src/resources/category/selects/category.select'

export const productCardSelect = {
	id: true,
	name: true,
	posterPath: true,
	prices: {
		select: {
			price: true,
		},
	},
	brand: {
		select: {
			name: true,
			slug: true,
			logoPath: true,
		},
	},
	category: {
		select: categoryNestedSelect,
	},
	rating: true,
	visibility: true,
	_count: {
		select: {
			reviews: true,
		},
	},
}

export const productFullSelect = {
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
	brand: {
		select: brandNestedSelect,
	},
	category: {
		select: {
			id: true,
			...categoryNestedSelect,
		},
	},
	visibility: true,
}
