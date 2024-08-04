module.exports = {
	apps: [
		{
			name: 'nest-app',
			script: 'yarn',
			args: 'start',
			watch: true,
			ignore_watch: [
				'node_modules',
				'dist',
				'twelbi',
				'src/resources/mail/templates',
				'src/schema/schema.gql',
			],
			env: {
				NODE_ENV: 'production',
				REACT_APP_URL: 'https://keeywork.ru',
				CDN_EDGE_PREFIX: '/var/www',
				DOMAIN: 'keeywork.ru',
				NOTICE_DOMAIN: 'notice.keeywork.ru',
				EMAIL_SERVICE: 'beget',
				EMAIL_HOST: 'smtp.beget.com',
				EMAIL_PORT: '465',
				EMAIL_USER: 'support@keeywork.ru',
				EMAIL_PASSWORD: 'Koribla-1',
				NOTICE_PASSWORD: 'Koribla-1',
				NOTICE_PORT: '6379',
				PORT: '4200',
				DATABASE_URL:
					'postgresql://gurgen:Koribla-1@localhost:5432/freelance_rus?schema=public',
				JWT_SECRET: "&*!%@$^**&()&*>{:'<'}'>ASC:{'X><}",
				SHOP_ID: '376215',
				PAYMENT_TOKEN: 'test_bT4PaEnsWxVHGsA48aUJXjKJwH0CBdMF6VL3aoLiq0Y',
			},
		},
	],
}
