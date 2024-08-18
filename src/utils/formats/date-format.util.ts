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

	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')
	const seconds = date.getSeconds().toString().padStart(2, '0')

	let hours12 = (date.getHours() % 12 || 12).toString().padStart(2, '0')
	const ampm = date.getHours() < 12 ? 'AM' : 'PM'

	return format
		.replace('DD', day)
		.replace('MMMM', monthText)
		.replace('MM', monthNumber)
		.replace('YYYY', year)
		.replace('HH', hours)
		.replace('hh', hours12)
		.replace('mm', minutes)
		.replace('ss', seconds)
		.replace('A', ampm)
}
