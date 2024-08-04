export const dateFormat = (createdAt: Date, format: string) => {
	const date = new Date(createdAt)

	const months = [
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
	const month = months[monthIndex]
	const year = date.getFullYear().toString()

	return format.replace('DD', day).replace('MMMM', month).replace('YYYY', year)
}
