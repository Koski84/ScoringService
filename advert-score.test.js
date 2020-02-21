const as = require('./advert-score');
const {NO_IMAGES, HD_IMAGE, OTHER_IMAGE, NO_DESC, DESC_AVAILABLE} = as.const;

const mockFn = jest.fn().mockReturnValue(0);
class FakeAdvertScore extends as.AdvertScore { 
  evalDescriptionLength(desc) { 
    return mockFn(desc);
  }
}
const sut = new FakeAdvertScore();

test("AdvertScore can't be instantiated because it's abstract", () => {
  expect(() => new as.AdvertScore()).toThrow(Error);
});

test(`Adverts with no images score ${NO_IMAGES}`, () => {
  expect(sut.evalImages([])).toBe(NO_IMAGES);
  expect(sut.evalImages(null)).toBe(NO_IMAGES);
});

test(`Adverts score ${HD_IMAGE} per HD image & ${OTHER_IMAGE} per other images`, () => {
  expect(sut.evalImages([{ quality: 'HD' }])).toBe(HD_IMAGE);
  expect(sut.evalImages([{ quality: 'HD' }, { quality: 'HD' }])).toBe(HD_IMAGE * 2);
  expect(sut.evalImages([{ quality: 'SD' }])).toBe(OTHER_IMAGE);
  expect(sut.evalImages([{ quality: 'SD' }, { quality: 'SD' }])).toBe(OTHER_IMAGE * 2);
  expect(sut.evalImages([{ quality: 'HD' }, { quality: 'SD' }])).toBe(HD_IMAGE + OTHER_IMAGE);
})

test(`Adverts score ${NO_DESC} if they have no description`, () => {
  expect(sut.evalDescription('')).toBe(NO_DESC);
  expect(sut.evalDescription(null)).toBe(NO_DESC);
  expect(sut.evalDescription(undefined)).toBe(NO_DESC);
})

test(`Adverts score ${DESC_AVAILABLE} if they have description`, () => {
  expect(sut.evalDescription('lorem ipsum')).toBe(DESC_AVAILABLE);
})

test('evalDescriptionLength is called in concrete classes', () => {
  mockFn.mockClear();
  sut.evalDescription('lorem ipsum');
  expect(mockFn.mock.calls.length).toBe(1);
  expect(mockFn.mock.calls[0][0]).toBe('lorem ipsum');
})

test('evalDescriptionLength return value is added', () => {
  mockFn.mockClear();
  mockFn.mockReturnValue(30);
  expect(sut.evalDescription('lorem ipsum')).toBe(30 + DESC_AVAILABLE); 
})