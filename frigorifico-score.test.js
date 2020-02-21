const { FrigorificoScore } = require('./frigorifico-score');

var sut = new FrigorificoScore();

test('evalCompleteness is true if advert has height and image (base advert constraint)', () => {
  expect(sut.evalCompleteness({ height:"190", images: [ { quality: 'HD' }] })).toBeTruthy();
  expect(sut.evalCompleteness({ images: [ { quality: 'HD' }] })).toBeFalsy();
  expect(sut.evalCompleteness({ height:"190", images: [] })).toBeFalsy();
});

test('getScore works', () => {
  expect(() => sut.getScore({ height:"190", description: 'genial!', images: [ { quality: 'HD' }] })).not.toThrow();
});