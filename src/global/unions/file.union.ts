import { createUnionType } from '@nestjs/graphql'
import { FileUpload } from '../entities/global.entity'

export const FileUnion = createUnionType({
	name: 'FileUnion',
	types: () => [FileUpload, String] as const,
	resolveType(value) {
		if (typeof value === 'string') {
			return String
		} else {
			return FileUpload
		}
		if (value && value.filename) {
			
		}
		return null
	},
})
