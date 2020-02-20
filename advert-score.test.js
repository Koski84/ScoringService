const as = require('./advert-score');

test("AdvertScore can't be instantiated because it's abstract", () => {
  expect(() => new as.AdvertScore()).toThrow(Error);
});

const mockEvalDescriptionLenght = jest.fn();
class FakeAdvertScore extends as.AdvertScore { 
  evalDescriptionLength() { 
    mockEvalDescriptionLenght();
  }
}
const sut = new FakeAdvertScore();

test('Adverts with no images score -10', () => {
  expect(sut.evalImages([])).toBe(-10);
});

test('Adverts score 20 per HD image & 10 per other images', () => {
  expect(sut.evalImages([{ quality: 'HD' }])).toBe(as.const.HD_IMAGE);
  expect(sut.evalImages([{ quality: 'HD' }, { quality: 'HD' }])).toBe(as.const.HD_IMAGE * 2);
  expect(sut.evalImages([{ quality: 'SD' }])).toBe(as.const.OTHER_IMAGE);
  expect(sut.evalImages([{ quality: 'SD' }, { quality: 'SD' }])).toBe(as.const.OTHER_IMAGE * 2);
  expect(sut.evalImages([{ quality: 'HD' }, { quality: 'SD' }])).toBe(as.const.HD_IMAGE + as.const.OTHER_IMAGE);
})

test('Adverts score 5 if they have description', () => {
  expect(sut.evalDescription('')).toBe(0);
  expect(sut.evalDescription(null)).toBe(0);
  expect(sut.evalDescription(undefined)).toBe(0);
  expect(sut.evalDescription('lorem ipsum')).toBe(5);
})

test('evalDescriptionLength is called on concrete classes', () => {
  mockEvalDescriptionLenght.mockClear();
  sut.evalDescription('lorem ipsum');
  expect(mockEvalDescriptionLenght.mock.calls.length).toBe(1);
})