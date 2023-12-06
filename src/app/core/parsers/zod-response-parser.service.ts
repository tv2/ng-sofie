import { ResponseParser } from '../abstractions/response-parser.service'
import * as zod from 'zod'

export class ZodResponseParser implements ResponseParser {
  private readonly statusParser = zod.object({
    status: zod.literal('success').or(zod.literal('fail')).or(zod.literal('error')),
  })

  private readonly successParser = this.statusParser.extend({
    data: zod.object({}).passthrough().or(zod.literal(null)),
  })

  private readonly failParser = this.statusParser.extend({
    data: zod.object({}).passthrough().or(zod.literal(null)),
  })

  private readonly errorParser = this.statusParser.extend({
    code: zod.string().min(1),
    message: zod.string().min(1),
  })

  public parseResponse(response: unknown): unknown {
    const partialParse: { status: 'success' | 'fail' | 'error' } = this.statusParser.parse(response)

    switch (partialParse.status) {
      case 'success':
        const successParse = this.successParser.parse(response)
        return successParse.data ?? undefined
      case 'fail':
        const failParse = this.failParser.parse(response)
        throw new Error(failParse.data ? JSON.stringify(failParse.data) : undefined)
      case 'error':
        const errorParse = this.errorParser.parse(response)
        throw new Error(errorParse.message)
    }
  }
}
