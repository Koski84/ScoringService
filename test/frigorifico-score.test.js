const { FrigorificoScore } = require('../template/frigorifico-score')

var sut = new FrigorificoScore()

test('evalCompleteness is true if advert has height and image (base advert constraint)', () => {
  sut.evalCompletenessAsync({ height: '190', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeTruthy())
  sut.evalCompletenessAsync({ images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompletenessAsync({ height: '190', images: [] }).then(value => expect(value).toBeFalsy())
})

test('getScoreAsync works', () => {
  expect(() => sut.getScoreAsync({ height: '190', description: 'genial!', images: [{ quality: 'HD' }] })).not.toThrow()
})
