import { Injectable } from '@nestjs/common'
import { createWriteStream, ensureDir, unlink } from 'fs-extra'
import type { FileUpload } from 'graphql-upload-ts'
import { SERVER_STATIC } from 'src/global/constants/global.constants'
import { PrismaService } from 'src/prisma/prisma.service'
import { generateSlug } from 'src/utils/helpers/generate-slug.util'
import { pipeline } from 'stream/promises'

@Injectable()
export class HookService {
	constructor(private readonly prisma: PrismaService) {}

	async uniqueSlug(name: string, variant: string, number = 1) {
		const newName = `${name}-${number}`

		const isExist = await this.prisma[variant].findUnique({
			where: {
				slug: generateSlug(name),
			},
		})

		if (!isExist) {
			return newName
		} else {
			return this.uniqueSlug(name, variant, number + 1)
		}
	}

	async uploadFile(folderName: string, file: FileUpload, currentPath?: string) {
		const { createReadStream, filename } = await file

		const folderPath = `${SERVER_STATIC.PATH}/${folderName}`

		ensureDir(folderPath)

		const filePath = `${folderName}/${filename}`

		const fullPath = `/${SERVER_STATIC.NAME}/${filePath}`

		if (currentPath) {
			await unlink(`${SERVER_STATIC.ROOT}/${currentPath}`)
		}

		const readStream = createReadStream()

		await pipeline(
			readStream,
			createWriteStream(`${SERVER_STATIC.PATH}/${filePath}`)
		)

		return fullPath
	}

	async deleteFile(path: string) {
		await unlink(path)
	}
}
