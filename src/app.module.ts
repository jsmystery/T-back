import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { ServeStaticModule } from '@nestjs/serve-static'
import { AppResolver } from './app.resolver'
import { AppService } from './app.service'
import { getGraphQLConfig } from './config/graphql.config'
import { GlobalModule } from './global.module'
import { SERVER_STATIC } from './global/constants/global.constants'
import { AdvertisingModule } from './resources/advertising/advertising.module'
import { BrandModule } from './resources/brand/brand.module'
import { CategoryModule } from './resources/category/category.module'
import { MailModule } from './resources/mail/mail.module'
import { ProductModule } from './resources/product/product.module'
import { UserModule } from './resources/user/user.module'
import { ReviewModule } from './resources/review/review.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			useFactory: getGraphQLConfig,
		}),
		ServeStaticModule.forRoot({
			rootPath: SERVER_STATIC.PATH,
			serveRoot: `/${SERVER_STATIC.NAME}`,
		}),
		GlobalModule,
		MailModule,
		CategoryModule,
		UserModule,
		ProductModule,
		AdvertisingModule,
		BrandModule,
		ReviewModule,
	],
	providers: [AppResolver, AppService],
})
export class AppModule {}
