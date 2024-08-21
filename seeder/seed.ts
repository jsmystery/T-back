import { PrismaClient, Product } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

const createProducts = async (quantity: number) => {
	const products: Product[] = []

	const category = await prisma.category.create({
		data: {
			name: 'Авто, мото',
			slug: 'avto-moto',
			smallImagePath: '/uploads/categories/category-1-small-image.png',
			bigImagePath: '/uploads/categories/category-1-big-image.png',
		},
	})

	const brand = await prisma.brand.create({
		data: {
			name: 'Lacoste Россия',
			slug: 'lacoste-russian',
			city: 'Москва',
			logoPath: '/uploads/brands/brand-1-logo.png',
			about:
				'Кстати, непосредственные участники технического прогресса формируют глобальную экономическую сеть и при этом — ограничены исключительно образом мышления. Но явные признаки победы институционализации представляют собой не что иное, как квинтэссенцию победы маркетинга над разумом и должны быть своевременно верифицированы. Задача организации, в особенности же сложившаяся структура организации обеспечивает широкому кругу (специалистов) участие в формировании укрепления моральных ценностей.',
			category: {
				connect: {
					id: category.id,
				},
			},
			user: {
				connect: {
					id: 6,
				},
			},
		},
	})

	for (let i = 0; i < quantity; i++) {
		const product = await prisma.product.create({
			data: {
				name: `Продукт ${i}`,
				about:
					'Футболка Lacoste - идеальный выбор для всех ценителей стиля и качества. Эта уникальная футболка изготовлена из смеси высококачественного хлопка и льна, что обеспечивает комфорт и прочность изделия. Сочетание этих материалов делает футболку Lacoste идеальной для повседневной носки.<br /> <br />Состав футболки Lacoste составляет 70% хлопка и 30% льна, что делает ее не только удобной, но и легкой и дышащей. Ткань приятна к телу и не вызывает раздражения даже при длительном ношении. Эта футболка станет незаменимым элементом гардероба как для повседневного использования, так и для особых случаев.<br /><br />Приобретая футболку Lacoste в официальном магазине, вы гарантированно получаете продукт высочайшего качества и оригинальной фирменный стиль. Будьте уверены, что ваш образ будет безупречен и стильный с этой футболкой от Lacoste.<br /><br />Не упустите возможность обновить свой гардероб с помощью футболки Lacoste - надежной и стильной базовой вещи, которая дополнит любой ваш образ.',
				sku: `159580428${i}`,
				posterPath: `/uploads/products/product-${i}-poster.png`,
				videoPath: `/uploads/products/product-${i}-video.mp4`,
				imagesPaths: [
					`/uploads/products/product-${i}-image-1.png`,
					`/uploads/products/product-${i}-image-2.png`,
					`/uploads/products/product-${i}-image-4.png`,
					`/uploads/products/product-${i}-image-5.png`,
					`/uploads/products/product-${i}-image-6.png`,
				],
				prices: {
					createMany: {
						data: [
							{
								price: 1000,
								minQuantity: 5,
							},
							{
								price: 800,
								minQuantity: 100,
							},
							{
								price: 500,
								minQuantity: 1000,
							},
						],
					},
				},
				brand: {
					connect: {
						id: brand.id,
					},
				},
				category: {
					connect: {
						id: category.id,
					},
				},
			},
		})

		products.push(product)
	}

	console.log(`Created ${products.length} products`)
}

async function main() {
	console.log('Start seeding ...')
	await createProducts(10)
}

main()
	.catch((e) => console.error(e))
	.finally(async () => {
		await prisma.$disconnect()
	})
