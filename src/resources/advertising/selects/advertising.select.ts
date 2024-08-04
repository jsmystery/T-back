export const advertisingCardSelect = {
	id: true,
	smallImagePath: true,
	bigImagePath: true,
	resolution: true,
	url: true,
	alt: true,
	type: true,
	visibility: true,
}

export const advertisingFullSelect = {
	...advertisingCardSelect,
	weekPrice: true,
	monthPrice: true,
}
