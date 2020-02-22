const { VehiculoScore } = require('./vehiculo-score');

var sut = new VehiculoScore();

test('evalCompleteness is true if advert has description, kms, color, manufacturer and image (base advert constraint)', () => {
  expect(sut.evalCompleteness({ description: 'Muy veloz!', km: '200', color: 'Rojo', fabricant: 'Seat', images: [ { quality: 'HD' }] })).toBeTruthy();
  expect(sut.evalCompleteness({ description: '', km: '200', color: 'Rojo', fabricant: 'Seat', images: [ { quality: 'HD' }] })).toBeFalsy();
  expect(sut.evalCompleteness({ description: 'Muy veloz!', km: '', color: 'Rojo', fabricant: 'Seat', images: [ { quality: 'HD' }] })).toBeFalsy();
  expect(sut.evalCompleteness({ description: 'Muy veloz!', km: '200', color: '', fabricant: 'Seat', images: [ { quality: 'HD' }] })).toBeFalsy();
  expect(sut.evalCompleteness({ description: 'Muy veloz!', km: '200', color: 'Rojo', fabricant: '', images: [ { quality: 'HD' }] })).toBeFalsy();
  expect(sut.evalCompleteness({ description: 'Muy veloz!', km: '200', color: 'Rojo', fabricant: 'Seat', images: [] })).toBeFalsy();
});

test('getScore works', () => {
  expect(() => sut.getScore({ description: 'genial!', images: [ { quality: 'HD' }] })).not.toThrow();
});