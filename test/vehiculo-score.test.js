const { VehiculoScore } = require('../template/vehiculo-score')

var sut = new VehiculoScore()

test('evalCompleteness is true if advert has description, kms, color, manufacturer and image (base advert constraint)', () => {
  sut.evalCompletenessAsync({ description: 'Muy veloz!', km: '200', color: 'Rojo', fabricant: 'Seat', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeTruthy())
  sut.evalCompletenessAsync({ description: '', km: '200', color: 'Rojo', fabricant: 'Seat', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompletenessAsync({ description: 'Muy veloz!', km: '', color: 'Rojo', fabricant: 'Seat', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompletenessAsync({ description: 'Muy veloz!', km: '200', color: '', fabricant: 'Seat', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompletenessAsync({ description: 'Muy veloz!', km: '200', color: 'Rojo', fabricant: '', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompletenessAsync({ description: 'Muy veloz!', km: '200', color: 'Rojo', fabricant: 'Seat', images: [] }).then(value => expect(value).toBeFalsy())
})

test('getScoreAsync works', () => {
  expect(() => sut.getScoreAsync({ description: 'genial!', images: [{ quality: 'HD' }] })).not.toThrow()
})
