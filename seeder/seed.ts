import { PrismaClient, Product } from '@prisma/client'
import { AdvertisingType } from '../src/resources/advertising/enums/advertising-type.enum'

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

	await prisma.user.upsert({
	  where: { id: 7 },
	  update: {}, // Не обновляем ничего, если пользователь уже существует
	  create: {
		 id: 7, // Указываем нужный ID (если не используем автогенерацию, убери это поле)
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

	const categories = [
//   {
//     name: 'Авто, мото',
//     slug: 'avto-moto',
//     smallImagePath: '/uploads/categories/category-1-small-image.png',
//     bigImagePath: '/uploads/categories/category-1-big-image.png',
//   },
  {
    name: 'Дом, дача, сад',
    slug: 'dom-dacha-sad',
    smallImagePath: '/uploads/categories/category-2-small-image.png',
    bigImagePath: '/uploads/categories/category-2-big-image.png',
  },
  {
    name: 'Животные и растения',
    slug: 'jivotnie-i-rastenia',
    smallImagePath: '/uploads/categories/category-3-small-image.png',
    bigImagePath: '/uploads/categories/category-3-big-image.png',
  },
  {
    name: 'Книги, канцелярия',
    slug: 'knigi-kancelaria',
    smallImagePath: '/uploads/categories/category-4-small-image.png',
    bigImagePath: '/uploads/categories/category-4-big-image.png',
  },
  {
    name: 'Косметика, гигиена',
    slug: 'kosmetika-gigiena',
    smallImagePath: '/uploads/categories/category-5-small-image.png',
    bigImagePath: '/uploads/categories/category-5-big-image.png',
  },
  {
    name: 'Мебель',
    slug: 'mebel',
    smallImagePath: '/uploads/categories/category-6-small-image.png',
    bigImagePath: '/uploads/categories/category-6-big-image.png',
  },
  {
    name: 'Медицина, здоровье',
    slug: 'medicina-zdorovye',
    smallImagePath: '/uploads/categories/category-7-small-image.png',
    bigImagePath: '/uploads/categories/category-7-big-image.png',
  },
  {
    name: 'Музыка, творчество, искусство',
    slug: 'muzika-tvorchestvo-iskustvo',
    smallImagePath: '/uploads/categories/category-8-small-image.png',
    bigImagePath: '/uploads/categories/category-8-big-image.png',
  },
  {
    name: 'Одежда, обувь, аксессуары',
    slug: 'odejda-obuv-aksesuari',
    smallImagePath: '/uploads/categories/category-9-small-image.png',
    bigImagePath: '/uploads/categories/category-9-big-image.png',
  },
  {
    name: 'Подарки, сувениры',
    slug: 'podarki-suveniri',
    smallImagePath: '/uploads/categories/category-10-small-image.png',
    bigImagePath: '/uploads/categories/category-10-big-image.png',
  },
  {
    name: 'Продукты питания, напитки',
    slug: 'produkti-pitania-napitki',
    smallImagePath: '/uploads/categories/category-11-small-image.png',
    bigImagePath: '/uploads/categories/category-11-big-image.png',
  },
]

await prisma.$transaction(
  categories.map((category) =>
    prisma.category.upsert({
      where: { slug: category.slug },
      update: {}, // No update operation needed, empty object
      create: {
        name: category.name,
        slug: category.slug,
        smallImagePath: category.smallImagePath,
        bigImagePath: category.bigImagePath,
      },
    })
  )
)

console.log('Categories seeded successfully!')


	// Используем upsert для создания или обновления бренда

	const brands = [
		await prisma.brand.upsert({
			where: { slug: 'lacoste-russia' },
			update: {},
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
		}),
		await prisma.brand.upsert({
			where: { slug: 'lacoste-kazan' },
			update: {},
			create: {
				name: 'Lac Казань',
				slug: 'lacoste-kazan',
				city: 'Казань',
				logoPath: '/uploads/brands/brand-2-logo.png',
				about:
					'Кстати, непосредственные участники технического прогресса формируют глобальную экономическую сеть и при этом — ограничены исключительно образом мышления...',
				category: {
					connect: {
						id: category.id,
					},
				},
				user: {
					connect: {
						id: 7,
					},
				},
			},
		}),
		await prisma.brand.upsert({
			where: { slug: 'Fabric-13' },
			update: {},
			create: {
				name: 'Fabric-13',
				slug: 'fabric-13',
				city: 'Москва',
				logoPath: '/uploads/brands/brand-1.png',
				about:
					'Кстати, непосредственные участники технического прогресса формируют глобальную экономическую сеть и при этом — ограничены исключительно образом мышления...',
				category: {
					connect: {
						id: category.id,
					},
				},
				user: {
					connect: {
						id: 7,
					},
				},
			},
		}),
		await prisma.brand.upsert({
			where: { slug: 'Prime-kraft' },
			update: {},
			create: {
				name: 'Prime Kraft',
				slug: 'prime-kraft',
				city: 'Москва',
				logoPath: '/uploads/brands/brand-3.png',
				about:
					'Кстати, непосредственные участники технического прогресса формируют глобальную экономическую сеть и при этом — ограничены исключительно образом мышления...',
				category: {
					connect: {
						id: category.id,
					},
				},
				user: {
					connect: {
						id: 7,
					},
				},
			},
		}),
	]


	// Генерация продуктов
	for (let i = 0; i < quantity; i++) {
		
		const randomBrand = brands[Math.floor(Math.random() * brands.length)]


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
				rating: 1,
				prices: {
					createMany: {
						data: [
							{
								price: 2000 + i * 10, // Уникальная цена
								minQuantity: 2,
							},
							{
								price: 1000 + i * 5, // Уникальная цена
								minQuantity: 5,
							},
							{
								price: 800 + i * 2, // Уникальная цена
								minQuantity: 100,
							},
							{
								price: 500 + i * 1, // Уникальная цена
								minQuantity: 1000,
							},
						],
					},
				},
				
				brand: {
					connect: {
						// id: useFirstBrand ? brand.id : brand2.id,
						id: randomBrand.id, // Присваиваем случайно выбранный бренд
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

const createAdvertisements = async () => {
	const advertisements = [
		{
			id: 1,
			bigImagePath: '/uploads/advertisements/advertising-4-big-image.png',
			smallImagePath: '/uploads/advertisements/advertising-4-small-image.png',
			url: '/',
			alt: 'Реклама',
			resolution: 550,
			type: AdvertisingType.CARD, 
			weekPrice: 1000,
			monthPrice: 3000,
		},
		{
			id: 2,
			bigImagePath: '/uploads/advertisements/advertising-5-big-image.png',
			smallImagePath: '/uploads/advertisements/advertising-5-small-image.png',
			url: '/',
			alt: 'Реклама',
			resolution: 550,
			type: AdvertisingType.CARD, 
			weekPrice: 1200,
			monthPrice: 3500,
		},
		{
			id: 3,
			bigImagePath: '/uploads/advertisements/advertising-6-big-image.png',
			smallImagePath: '/uploads/advertisements/advertising-6-small-image.png',
			url: '/',
			alt: 'Реклама',
			resolution: 550,
			type: AdvertisingType.CARD, 
			weekPrice: 1500,
			monthPrice: 4000,
		},
	]

	await prisma.$transaction(
		advertisements.map((advertising) =>
			prisma.advertising.upsert({
				where: { id: advertising.id },
				update: {}, // Оставляем пустым, если не требуется обновление
				create: {
					id: advertising.id,
					bigImagePath: advertising.bigImagePath,
					smallImagePath: advertising.smallImagePath,
					url: advertising.url,
					alt: advertising.alt,
					resolution: advertising.resolution,
					type: advertising.type,
					weekPrice: advertising.weekPrice,
					monthPrice: advertising.monthPrice,
				},
			})
		)
	)

	console.log('Advertisements seeded successfully!')
}


async function main() {
	console.log('Start seeding ...')
	await createUsers();
	await createProducts(20)
	await createAdvertisements(); 
}

main()
	.catch((e) => console.error(e))
	.finally(async () => {
		await prisma.$disconnect()
	})
