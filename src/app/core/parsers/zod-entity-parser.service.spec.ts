import { ZodEntityParser } from './zod-entity-parser.service'
import { StudioConfiguration } from '../../shared/services/studio-configuration'

describe(ZodEntityParser.name, () => {
  describe(ZodEntityParser.prototype.parseStudioConfiguration.name, () => {
    it('parses a studio configuration with url on http protocol and hostname', () => {
      const testee: ZodEntityParser = new ZodEntityParser()
      const expectedStudioConfiguration: StudioConfiguration = {
        data: {
          settings: {
            mediaPreviewUrl: 'http://some.url',
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
        },
      }
      const result = (): StudioConfiguration => testee.parseStudioConfiguration(expectedStudioConfiguration)
      expect(result).toThrow()
    })
  })
})
