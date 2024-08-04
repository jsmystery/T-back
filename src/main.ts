import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { graphqlUploadExpress } from 'graphql-upload-ts'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	app.enableCors({
		origin: process.env.REACT_APP_URL,
		credentials: true,
		allowedHeaders: [
			'Accept',
			'Authorization',
			'Content-Type',
			'X-Requested-With',
			'Apollo-Require-Preflight',
		],
		methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
	})
	app.use(cookieParser())
	app.use(graphqlUploadExpress({ maxFileSize: 10000000000, maxFiles: 10 }))
	app.disable('x-powered-by')
	app.setGlobalPrefix('api')
	await app.listen(process.env.PORT)
}
bootstrap()
