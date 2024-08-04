export const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export const SERVER_STATIC = {
	ROOT: IS_PRODUCTION ? process.env.CDN_EDGE_PREFIX : process.cwd(),
	PATH: `${IS_PRODUCTION ? process.env.CDN_EDGE_PREFIX : process.cwd()}/twelbi`,
	NAME: 'twelbi',
}
