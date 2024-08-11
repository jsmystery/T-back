import { categoryNestedSelect } from 'src/resources/category/selects/category.select'

export const brandSelect = {
	id: true,
	name: true,
	logoPath: true,
	city: true,
	rating: true,
	about: true,
	createdAt: true,
	subscribers: true,
	_count: {
		select: {
			reviews: true,
			products: true,
		},
	},
}

export const brandNestedSelect = {
	id: true,
	name: true,
	slug: true,
	logoPath: true,
}

export const productBrandNestedSelect = {
	...brandNestedSelect,
	rating: true,
	phoneNumber: true,
	subscribers: true,
	userId: true,
}

export const brandCardSelect = {
	id: true,
	name: true,
	slug: true,
	logoPath: true,
	rating: true,
	_count: {
		select: {
			reviews: true,
		},
	},
	category: {
		select: categoryNestedSelect,
	},
}

export const accountBrandSelect = {
	id: true,
	logoPath: true,
	name: true,
	city: true,
	balance: true,
	subscribers: true,
	user: {
		select: {
			profile: {
				select: {
					email: true,
					telegram: true,
					phone: true,
					whatsapp: true,
				},
			},
		},
	},
	_count: {
		select: {
			products: true,
		},
	},
	createdAt: true,
}
