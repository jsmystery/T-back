export const dateFormat = (createdAt: Date, format: string) => {
	const date = new Date(createdAt)

	const monthsText = [
		'января',
		'февраля',
		'марта',
		'апреля',
		'мая',
		'июня',
		'июля',
		'августа',
		'сентября',
		'октября',
		'ноября',
		'декабря',
	]

	const day = date.getDate().toString().padStart(2, '0')
	const monthIndex = date.getMonth()
	const monthNumber = (monthIndex + 1).toString().padStart(2, '0')
	const monthText = monthsText[monthIndex]
	const year = date.getFullYear().toString()

	return format
		.replace('DD', day)
		.replace('MM', monthNumber)
		.replace('MMMM', monthText)
		.replace('YYYY', year)
}
