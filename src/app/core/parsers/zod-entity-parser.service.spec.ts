import { ZodEntityParser } from './zod-entity-parser.service'
import { Tv2Action, Tv2ActionContentType } from '../../shared/models/tv2-action'
import { Media } from '../../shared/services/media'
import { PartActionType } from '../../shared/models/action-type'

describe(ZodEntityParser.name, () => {
  describe(ZodEntityParser.prototype.parseTv2Action.name, () => {
    it('parses a Tv2Action data ', () => {
      const testee: ZodEntityParser = new ZodEntityParser()
      const expectedTv2Action: Tv2Action = {
        metadata: {
          contentType: Tv2ActionContentType.VIDEO_CLIP,
        },
        type: PartActionType.INSERT_PART_AS_NEXT,
        id: 'somePartId',
        name: 'somePartName',
      }
      const parseTv2Action: Tv2Action = testee.parseTv2Action(expectedTv2Action)
      expect(parseTv2Action).toEqual(expectedTv2Action)
    })
  })

  describe(ZodEntityParser.prototype.parseMediaAsset.name, () => {
    it('parses a Media data ', () => {
      const testee: ZodEntityParser = new ZodEntityParser()
      const expectedMedia: Media = {
        id: '123',
        sourceName: 'source',
        duration: 123,
      }
      const parseMedia: Media = testee.parseMediaAsset(expectedMedia)
      expect(parseMedia).toEqual(expectedMedia)
    })
  })
})
