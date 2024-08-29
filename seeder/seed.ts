import { PrismaClient, Product } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

const createUsers = async () => {
	// Создание пользователя с ролью PROVIDER
	await prisma.user.upsert({
	  where: { id: 6 },
	  update: {}, // Не обновляем ничего, если пользователь уже существует
	  create: {
		 id: 6, // Указываем нужный ID (если не используем автогенерацию, убери это поле)
		 role: 'PROVIDER', // Значение по умолчанию
	  },
	});
 }



const createProducts = async (quantity: number) => {
	const products: Product[] = []

	// Используем upsert для создания или обновления категории
	const category = await prisma.category.upsert({
		where: { slug: 'avto-moto' },
		update: {}, // Оставляем пустым, если не требуется обновление
		create: {
			name: 'Авто, мото',
			slug: 'avto-moto',
			smallImagePath: '/uploads/categories/category-1-small-image.png',
			bigImagePath: '/uploads/categories/category-1-big-image.png',
		},
	})

	// Используем upsert для создания или обновления бренда
	const brand = await prisma.brand.upsert({
		where: { slug: 'lacoste-russia' },
		update: {}, // Оставляем пустым, если не требуется обновление
		create: {
			name: 'Lacoste Россия',
			slug: 'lacoste-russia',
			city: 'Москва',
			logoPath: '/uploads/brands/brand-1-logo.png',
			about:
				'Кстати, непосредственные участники технического прогресса формируют глобальную экономическую сеть и при этом — ограничены исключительно образом мышления...',
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

	// Генерация продуктов
	for (let i = 0; i < quantity; i++) {
		const product = await prisma.product.create({
			data: {
				name: `Продукт ${i}`,
				about:
					'Футболка Lacoste - идеальный выбор для всех ценителей стиля и качества...',
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
	await createUsers();
	await createProducts(10)
}

main()
	.catch((e) => console.error(e))
	.finally(async () => {
		await prisma.$disconnect()
	})
