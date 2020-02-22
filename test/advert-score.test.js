const { AdvertScore, scoring } = require('../advert-score')
const { NO_IMAGES_SC, HD_IMAGE_SC, OTHER_IMAGE_SC, NO_DESC_SC, DESC_AVAILABLE_SC, KEYWORD_SC, COMPLETENESS_SC } = scoring

const mockFn = jest.fn().mockReturnValue(0)
class FakeAdvertScore extends AdvertScore {
  constructor () {
    super()

    // Setting keywords here in order to avoid these tests get broken if keywords are changed
    this.KEYWORDS_ARRAY = ['Luminoso', 'Cuidado', 'Fabuloso', 'Único', 'Excepcional', 'Ocasión']
  }

  evalDescriptionLength (desc) {
    return mockFn(desc)
  }
}

const sut = new FakeAdvertScore()

test("AdvertScore can't be instantiated because it's abstract", () => {
  expect(() => new AdvertScore()).toThrow(Error)
})

describe('Image scoring tests', () => {
  test(`Adverts with no images score ${NO_IMAGES_SC}`, () => {
    sut.evalImages([]).then(value => expect(value).toBe(NO_IMAGES_SC))
    sut.evalImages(null).then(value => expect(value).toBe(NO_IMAGES_SC))
  })

  test(`Adverts score ${HD_IMAGE_SC} per HD image & ${OTHER_IMAGE_SC} per other images`, () => {
    sut.evalImages([{ quality: 'HD' }]).then(value => expect(value).toBe(HD_IMAGE_SC))
    sut.evalImages([{ quality: 'HD' }, { quality: 'HD' }]).then(value => expect(value).toBe(HD_IMAGE_SC * 2))
    sut.evalImages([{ quality: 'SD' }]).then(value => expect(value).toBe(OTHER_IMAGE_SC))
    sut.evalImages([{ quality: 'SD' }, { quality: 'SD' }]).then(value => expect(value).toBe(OTHER_IMAGE_SC * 2))
    sut.evalImages([{ quality: 'HD' }, { quality: 'SD' }]).then(value => expect(value).toBe(HD_IMAGE_SC + OTHER_IMAGE_SC))
  })
})

describe('Description scoring tests', () => {
  test(`Adverts score ${NO_DESC_SC} if they have no description`, () => {
    sut.evalDescription('').then(value => expect(value).toBe(NO_DESC_SC))
    sut.evalDescription(null).then(value => expect(value).toBe(NO_DESC_SC))
    sut.evalDescription(undefined).then(value => expect(value).toBe(NO_DESC_SC))
  })

  test(`Adverts score ${DESC_AVAILABLE_SC} if they have description`, () => {
    sut.evalDescription('lorem ipsum').then(value => expect(value).toBe(DESC_AVAILABLE_SC))
  })

  test('evalDescriptionLength is called in concrete classes', () => {
    mockFn.mockClear()
    sut.evalDescription('lorem ipsum')
    expect(mockFn.mock.calls.length).toBe(1)
    expect(mockFn.mock.calls[0][0]).toBe('lorem ipsum')
  })

  test('evalDescriptionLength return value is added', () => {
    mockFn.mockClear()
    mockFn.mockReturnValue(30)
    sut.evalDescription('lorem ipsum').then(value => expect(value).toBe(30 + DESC_AVAILABLE_SC))
  })

  test(`evalKeywords gets ${KEYWORD_SC} points per keyword`, () => {
    sut.evalKeywords('Luminoso').then(value => expect(value).toBe(KEYWORD_SC))
    sut.evalKeywords('Luminoso y Cuidado').then(value => expect(value).toBe(KEYWORD_SC * 2))
  })

  test("evalKeywords doesn't get points for keyword repetitions", () => {
    sut.evalKeywords('Cuidado Cuidado Cuidado').then(value => expect(value).toBe(KEYWORD_SC))
  })

  test('Letter case is ignored when searching for keywords', () => {
    sut.evalKeywords('ojo cuidado, esto es fabuloso').then(value => expect(value).toBe(KEYWORD_SC * 2))
  })

  test('But accent mark is not. You should write propertly', () => {
    sut.evalKeywords('No dejes pasar esta ocasión').then(value => expect(value).toBe(KEYWORD_SC))
    sut.evalKeywords('No dejes pasar esta ocasion').then(value => expect(value).toBe(0))
  })

  test('Keywords preffixes or suffixes invalidate the match', () => {
    sut.evalKeywords('Cuidadoso o excepcionalmente no cuentan').then(value => expect(value).toBe(0))
    sut.evalKeywords('Cuidado y excepcional si lo hacen').then(value => expect(value).toBe(KEYWORD_SC * 2))
    sut.evalKeywords('Cuidado, aunque lleve la coma detrás, también contaría').then(value => expect(value).toBe(KEYWORD_SC))
  })
})

describe('Completeness tests', () => {
  test('evalCompleteness is true when there is one image at least', () => {
    sut.evalCompleteness({}).then(value => expect(value).toBeFalsy())
    sut.evalCompleteness({ images: [] }).then(value => expect(value).toBeFalsy())
    sut.evalCompleteness(null).then(value => expect(value).toBeFalsy())
    sut.evalCompleteness(undefined).then(value => expect(value).toBeFalsy())
    sut.evalCompleteness({ images: [{}] }).then(value => expect(value).toBeTruthy())
    sut.evalCompleteness({ images: [{}, {}] }).then(value => expect(value).toBeTruthy())
  })
})

describe('Main function getScore tests', () => {
  const evalImagesMock = jest.fn()
  const evalDescriptionMock = jest.fn()
  const evalKeywordsMock = jest.fn()
  const evalCompletenessMock = jest.fn()

  class FullMockedAdvertScore extends AdvertScore {
    evalImages (images) {
      return evalImagesMock(images)
    }

    evalDescription (description) {
      return evalDescriptionMock(description)
    }

    evalKeywords (description) {
      return evalKeywordsMock(description)
    }

    evalCompleteness (advert) {
      return evalCompletenessMock(advert)
    }
  }

  const sut = new FullMockedAdvertScore()

  const arrayOfImages = [{ quality: 'HD' }]
  const desc = 'lorem ipsum'

  const advert = {
    images: arrayOfImages,
    description: desc
  }

  test('Parcial scoring functions are called', () => {
    sut.getScore(advert)

    expect(evalImagesMock.mock.calls.length).toBe(1)
    expect(evalImagesMock.mock.calls[0][0]).toBe(arrayOfImages)

    expect(evalDescriptionMock.mock.calls.length).toBe(1)
    expect(evalDescriptionMock.mock.calls[0][0]).toBe(desc)

    expect(evalKeywordsMock.mock.calls.length).toBe(1)
    expect(evalKeywordsMock.mock.calls[0][0]).toBe(desc)

    expect(evalCompletenessMock.mock.calls.length).toBe(1)
    expect(evalCompletenessMock.mock.calls[0][0]).toBe(advert)
  })

  test('Parcial scores are added and returned', () => {
    evalImagesMock.mockReturnValue(1)
    evalDescriptionMock.mockReturnValue(2)
    evalKeywordsMock.mockReturnValue(3)

    sut.getScore(advert).then(value => expect(value).toBe(6))
  })

  test(`If advert is complete, then ${COMPLETENESS_SC} points are added`, () => {
    evalCompletenessMock.mockReturnValue(true)

    sut.getScore(advert).then(value => expect(value).toBe(COMPLETENESS_SC + 6))
  })
})
