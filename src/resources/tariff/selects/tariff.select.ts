export const nestedTariffSelect = {
	type: true,
}

export const tariffSelect = {
	...nestedTariffSelect,
	price: true,
	description: true,
	duration: true,
}
