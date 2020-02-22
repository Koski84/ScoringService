const { VehiculoScore } = require('../vehiculo-score')

var sut = new VehiculoScore()

test('evalCompleteness is true if advert has description, kms, color, manufacturer and image (base advert constraint)', () => {
  sut.evalCompleteness({ description: 'Muy veloz!', km: '200', color: 'Rojo', fabricant: 'Seat', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeTruthy())
  sut.evalCompleteness({ description: '', km: '200', color: 'Rojo', fabricant: 'Seat', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompleteness({ description: 'Muy veloz!', km: '', color: 'Rojo', fabricant: 'Seat', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompleteness({ description: 'Muy veloz!', km: '200', color: '', fabricant: 'Seat', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompleteness({ description: 'Muy veloz!', km: '200', color: 'Rojo', fabricant: '', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompleteness({ description: 'Muy veloz!', km: '200', color: 'Rojo', fabricant: 'Seat', images: [] }).then(value => expect(value).toBeFalsy())
})

test('getScore works', () => {
  expect(() => sut.getScore({ description: 'genial!', images: [{ quality: 'HD' }] })).not.toThrow()
})
