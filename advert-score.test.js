const { AdvertScore, scoring } = require('./advert-score');
const { NO_IMAGES_SC, HD_IMAGE_SC, OTHER_IMAGE_SC, NO_DESC_SC, DESC_AVAILABLE_SC, KEYWORD_SC, COMPLETENESS_SC } = scoring;

const mockFn = jest.fn().mockReturnValue(0);
class FakeAdvertScore extends AdvertScore { 
  constructor() {
    super();

    // Setting keywords here in order to avoid these tests get broken if keywords are changed
    this.KEYWORDS_ARRAY = [ 'Luminoso', 'Cuidado', 'Fabuloso', 'Único', 'Excepcional', 'Ocasión' ];
  }
  
  evalDescriptionLength(desc) { 
    return mockFn(desc);
  }
}

const sut = new FakeAdvertScore();

test("AdvertScore can't be instantiated because it's abstract", () => {
  expect(() => new AdvertScore()).toThrow(Error);
});

describe('Image scoring tests' , () => {
  test(`Adverts with no images score ${NO_IMAGES_SC}`, () => {
    expect(sut.evalImages([])).toBe(NO_IMAGES_SC);
    expect(sut.evalImages(null)).toBe(NO_IMAGES_SC);
  });

  test(`Adverts score ${HD_IMAGE_SC} per HD image & ${OTHER_IMAGE_SC} per other images`, () => {
    expect(sut.evalImages([{ quality: 'HD' }])).toBe(HD_IMAGE_SC);
    expect(sut.evalImages([{ quality: 'HD' }, { quality: 'HD' }])).toBe(HD_IMAGE_SC * 2);
    expect(sut.evalImages([{ quality: 'SD' }])).toBe(OTHER_IMAGE_SC);
    expect(sut.evalImages([{ quality: 'SD' }, { quality: 'SD' }])).toBe(OTHER_IMAGE_SC * 2);
    expect(sut.evalImages([{ quality: 'HD' }, { quality: 'SD' }])).toBe(HD_IMAGE_SC + OTHER_IMAGE_SC);
  });
});

describe('Description scoring tests', () => {
  test(`Adverts score ${NO_DESC_SC} if they have no description`, () => {
    expect(sut.evalDescription('')).toBe(NO_DESC_SC);
    expect(sut.evalDescription(null)).toBe(NO_DESC_SC);
    expect(sut.evalDescription(undefined)).toBe(NO_DESC_SC);
  });

  test(`Adverts score ${DESC_AVAILABLE_SC} if they have description`, () => {
    expect(sut.evalDescription('lorem ipsum')).toBe(DESC_AVAILABLE_SC);
  });
  
  test('evalDescriptionLength is called in concrete classes', () => {
    mockFn.mockClear();
    sut.evalDescription('lorem ipsum');
    expect(mockFn.mock.calls.length).toBe(1);
    expect(mockFn.mock.calls[0][0]).toBe('lorem ipsum');
  });
  
  test('evalDescriptionLength return value is added', () => {
    mockFn.mockClear();
    mockFn.mockReturnValue(30);
    expect(sut.evalDescription('lorem ipsum')).toBe(30 + DESC_AVAILABLE_SC); 
  });
  
  test(`evalKeywords gets ${KEYWORD_SC} points per keyword`, () => {
    expect(sut.evalKeywords('Luminoso')).toBe(KEYWORD_SC);
    expect(sut.evalKeywords('Luminoso y Cuidado')).toBe(KEYWORD_SC * 2);
  });
  
  test("evalKeywords doesn't get points for keyword repetitions", () => {
    expect(sut.evalKeywords('Cuidado Cuidado Cuidado')).toBe(KEYWORD_SC);
  });
  
  test('Letter case is ignored when searching for keywords', () => {
    expect(sut.evalKeywords('ojo cuidado, esto es fabuloso')).toBe(KEYWORD_SC * 2);
  });
  
  test('But accent mark is not. You should write propertly', () => {
    expect(sut.evalKeywords('No dejes pasar esta ocasión')).toBe(KEYWORD_SC);
    expect(sut.evalKeywords('No dejes pasar esta ocasion')).toBe(0);
  });
  
  test('Keywords preffixes or suffixes invalidate the match', () => {
    expect(sut.evalKeywords('Cuidadoso o excepcionalmente no cuentan')).toBe(0);
    expect(sut.evalKeywords('Cuidado y excepcional si lo hacen')).toBe(KEYWORD_SC * 2);
    expect(sut.evalKeywords('Cuidado, aunque lleve la coma detrás, también contaría')).toBe(KEYWORD_SC);
  });
});

describe('Completeness tests', () => {
  test('evalCompleteness is true when there is one image at least', () => {
    expect(sut.evalCompleteness({})).toBeFalsy();
    expect(sut.evalCompleteness({ images: [] })).toBeFalsy();
    expect(sut.evalCompleteness(null)).toBeFalsy();
    expect(sut.evalCompleteness(undefined)).toBeFalsy();
    expect(sut.evalCompleteness({ images: [ {} ]})).toBeTruthy();
    expect(sut.evalCompleteness({ images: [ {}, {} ]})).toBeTruthy();
  });
});

describe('Main function getScore tests', () => {
  let evalImagesMock = jest.fn();
  let evalDescriptionMock = jest.fn();
  let evalKeywordsMock = jest.fn();
  let evalCompletenessMock = jest.fn();

  class FullMockedAdvertScore extends AdvertScore {
    evalImages(images) {
      return evalImagesMock(images);
    }
    evalDescription(description) {
      return evalDescriptionMock(description);
    }
    evalKeywords(description) {
      return evalKeywordsMock(description);
    }
    evalCompleteness(advert) {
      return evalCompletenessMock(advert);
    }
  }

  let sut = new FullMockedAdvertScore();
  
  let arrayOfImages = [ { quality: 'HD' }];
  let desc = 'lorem ipsum';

  let advert = {
    images: arrayOfImages,
    description: desc
  }
  
  test('Parcial scoring functions are called', () => {
    sut.getScore(advert);

    expect(evalImagesMock.mock.calls.length).toBe(1);
    expect(evalImagesMock.mock.calls[0][0]).toBe(arrayOfImages);

    expect(evalDescriptionMock.mock.calls.length).toBe(1);
    expect(evalDescriptionMock.mock.calls[0][0]).toBe(desc);

    expect(evalKeywordsMock.mock.calls.length).toBe(1);
    expect(evalKeywordsMock.mock.calls[0][0]).toBe(desc);

    expect(evalCompletenessMock.mock.calls.length).toBe(1);
    expect(evalCompletenessMock.mock.calls[0][0]).toBe(advert);
  });

  test('Parcial scores are added and returned', () => {
    evalImagesMock.mockReturnValue(1);
    evalDescriptionMock.mockReturnValue(2);
    evalKeywordsMock.mockReturnValue(3);
    expect(sut.getScore(advert)).toBe(6);
  });

  test(`If advert is complete, then ${COMPLETENESS_SC} points are added`, () => {
    evalCompletenessMock.mockReturnValue(true);
    expect(sut.getScore(advert)).toBe(COMPLETENESS_SC + 6);
  });
});