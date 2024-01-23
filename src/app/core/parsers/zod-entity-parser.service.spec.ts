import { ZodEntityParser } from './zod-entity-parser.service'
import { StudioConfiguration } from '../../shared/services/studio-configuration'
import { Tv2Action, Tv2ActionContentType } from '../../shared/models/tv2-action'
import { Media } from '../../shared/services/media'

describe(ZodEntityParser.name, () => {
  describe(ZodEntityParser.prototype.parseStudioConfiguration.name, () => {
    it('parses a studio configuration with url on http protocol and hostname', () => {
      const testee: ZodEntityParser = new ZodEntityParser()
      const expectedStudioConfiguration: StudioConfiguration = {
        data: {
          settings: {
            mediaPreviewUrl: 'http://some.url',
          },
          blueprintConfiguration: {
            ServerPostrollDuration: 123,
          },
        },
      }
      const parseStudioConfiguration: StudioConfiguration = testee.parseStudioConfiguration(expectedStudioConfiguration)
      expect(parseStudioConfiguration).toEqual(expectedStudioConfiguration)
    })

    it('does not parse a studio configuration with empty url', () => {
      const testee: ZodEntityParser = new ZodEntityParser()
      const expectedStudioConfiguration: StudioConfiguration = {
        data: {
          settings: {
            mediaPreviewUrl: '',
          },
          blueprintConfiguration: {
            ServerPostrollDuration: 123,
          },
        },
      }
      const result = (): StudioConfiguration => testee.parseStudioConfiguration(expectedStudioConfiguration)
      expect(result).toThrow()
    })

    it('does not parse a studio configuration with no host, just protocol', () => {
      const testee: ZodEntityParser = new ZodEntityParser()
      const expectedStudioConfiguration: StudioConfiguration = {
        data: {
          settings: {
            mediaPreviewUrl: 'http://',
          },
          blueprintConfiguration: {
            ServerPostrollDuration: 123,
          },
        },
      }
      const result = (): StudioConfiguration => testee.parseStudioConfiguration(expectedStudioConfiguration)
      expect(result).toThrow()
    })

    it('does not parse a studio configuration with protocol and just one letter host', () => {
      const testee: ZodEntityParser = new ZodEntityParser()
      const expectedStudioConfiguration: StudioConfiguration = {
        data: {
          settings: {
            mediaPreviewUrl: 'http://a',
          },
          blueprintConfiguration: {
            ServerPostrollDuration: 123,
          },
        },
      }
      const result = (): StudioConfiguration => testee.parseStudioConfiguration(expectedStudioConfiguration)
      expect(result).toThrow()
    })
  })

  describe(ZodEntityParser.prototype.parseTv2Action.name, () => {
    it('parses a Tv2Adtion ', () => {
      const testee: ZodEntityParser = new ZodEntityParser()
      const expectedTv2Action: Tv2Action = <Tv2Action>{
        metadata: {
          contentType: Tv2ActionContentType.UNKNOWN,
        },
      }
      const parseTv2Action: Tv2Action = testee.parseTv2Action(expectedTv2Action)
      expect(parseTv2Action).toEqual(expectedTv2Action)
    })
  })

  describe(ZodEntityParser.prototype.parseMedia.name, () => {
    it('parses a Media data ', () => {
      const testee: ZodEntityParser = new ZodEntityParser()
      const expectedMedia: Media = <Media>{
        id: '123',
        duration: 123,
      }
      const parseMedia: Media = testee.parseMedia(expectedMedia)
      expect(parseMedia).toEqual(expectedMedia)
    })
  })
})
