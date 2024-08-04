import { IS_PRODUCTION } from 'src/global/constants/global.constants'

export const getGraphQLConfig = () => {
	return {
		path: '/api/mygraphql',
		playground: !IS_PRODUCTION,
		autoSchemaFile: `${process.cwd()}/src/schema/schema.gql`,
		context: ({ req, res }) => ({
			req,
			res,
		}),
		sortSchema: true,
	}
}
