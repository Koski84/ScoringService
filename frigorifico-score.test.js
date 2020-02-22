const { FrigorificoScore } = require('./frigorifico-score')

var sut = new FrigorificoScore()

test('evalCompleteness is true if advert has height and image (base advert constraint)', () => {
  sut.evalCompleteness({ height: '190', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeTruthy())
  sut.evalCompleteness({ images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompleteness({ height: '190', images: [] }).then(value => expect(value).toBeFalsy())
})

test('getScore works', () => {
  expect(() => sut.getScore({ height: '190', description: 'genial!', images: [{ quality: 'HD' }] })).not.toThrow()
})
