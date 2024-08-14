import { seoSelect } from 'src/resources/seo/select/seo.select'

export const categoryNestedSelect = {
	name: true,
	slug: true,
}

export const categoryEditSelect = {
	id: true,
	name: true,
}

export const categoryCardSelect = {
	name: true,
	slug: true,
	smallImagePath: true,
	bigImagePath: true,
}

export const categoryFullSelect = {
	name: true,
	slug: true,
	smallImagePath: true,
	bigImagePath: true,
	seo: {
		select: seoSelect,
	},
}
