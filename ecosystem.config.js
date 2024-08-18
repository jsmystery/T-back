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
				REACT_APP_URL: 'https://keeywork.store',
				CDN_EDGE_PREFIX: '/var/www',
				DOMAIN: 'keeywork.store',
				EMAIL_SERVICE: 'beget',
				EMAIL_HOST: 'smtp.beget.com',
				EMAIL_PORT: '465',
				EMAIL_USER: 'support@keeywork.store',
				EMAIL_PASSWORD: 'Koribla-1',
				PORT: '4200',
				DATABASE_URL:
					'postgresql://gurgen:Koribla-1@localhost:5432/twelbi?schema=public',
				JWT_SECRET: "&*!%@$^**&()&*>{:'<'}'>ASC:{'X><}",
				SHOP_ID: '419446',
				PAYMENT_TOKEN: 'test_kS9TqBHzI_EeeuuV82iNk22epWr26hg3BK_dU-kQKEg',
				NOTICE_PORT: '6379',
				NOTICE_PASSWORD: 'Koribla-1',
				NOTICE_DOMAIN: 'notice.keeywork.store',
			},
		},
	],
}
