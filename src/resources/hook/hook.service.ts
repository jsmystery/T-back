import { Injectable } from '@nestjs/common'
import { createWriteStream, ensureDir, pathExists, unlink } from 'fs-extra'
import type { FileUpload } from 'graphql-upload-ts'
import { extname } from 'path'
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

	async uploadFile(
		folderName: string,
		fileName: string,
		file: FileUpload,
		currentPath?: string
	) {
		const { createReadStream, filename } = await file

		const extension = extname(filename)

		const folderPath = `${SERVER_STATIC.PATH}/${folderName}`

		ensureDir(folderPath)

		const filePath = `${folderName}/${fileName + extension}`

		const fullPath = `/${SERVER_STATIC.NAME}/${filePath}`

		if (currentPath) {
			const fullPath = `${SERVER_STATIC.ROOT}/${currentPath}`
			const exists = await pathExists(fullPath)

			if (exists) {
				await unlink(fullPath)
			}
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
