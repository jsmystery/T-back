import {
	categoryEditSelect,
	categoryNestedSelect,
} from 'src/resources/category/selects/category.select'

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
	city:true,
	about: true,
	logoPath: true,
}

export const productBrandNestedSelect = {
	id: true,
	name: true,
	slug: true,
	logoPath: true,
	rating: true,
	subscribers: true,
	userId: true,
	about: true,
	city: true,
	user: {
		select: {
			profile: {
				select: {
					phone: true,
					whatsapp: true,
					telegram: true,
				},
			},
		},
	},
}

export const brandCardSelect = {
	id: true,
	name: true,
	slug: true,
	logoPath: true,
	city: true,
	about: true,
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
	about: true,
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
	category: {
		select: categoryEditSelect,
	},
	_count: {
		select: {
			products: true,
		},
	},
	createdAt: true,
}
