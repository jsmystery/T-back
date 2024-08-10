import { productBrandNestedSelect } from 'src/resources/brand/selects/brand.select'
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

export const productSelect = {
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
	rating: true,
	reviews: true,
	views: true,
	brand: {
		select: productBrandNestedSelect,
	},
	category: {
		select: {
			id: true,
			...categoryNestedSelect,
		},
	},
	_count: {
		select: {
			reviews: true,
		},
	},
	visibility: true,
	createdAt: true,
}
