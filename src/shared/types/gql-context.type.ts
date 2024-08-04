import type { Request, Response } from 'express'

export interface GqlContext {
	res: Response
	req: Request
}
