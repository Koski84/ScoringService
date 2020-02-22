const { ChaletScore, scoring } = require('../chalet-score')
const { WORD_COUNT_LONG_DESCRIPTION, LONG_DESCRIPTION_SC } = scoring

var sut = new ChaletScore()

test('evalCompleteness is true if advert has description, area and image (base advert constraint)', () => {
  sut.evalCompletenessAsync({ description: 'Vistas al mar', size: '120', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeTruthy())
  sut.evalCompletenessAsync({ description: '', size: '120', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompletenessAsync({ description: 'Vistas al mar', size: '', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompletenessAsync({ description: 'Vistas al mar', size: '120', images: [] }).then(value => expect(value).toBeFalsy())
})

test('getScoreAsync works', () => {
  expect(() => sut.getScoreAsync({ description: 'Vistas a Mordor!' })).not.toThrow()
})

test(`evalDescriptionLength scores ${LONG_DESCRIPTION_SC} points if description is more than ${WORD_COUNT_LONG_DESCRIPTION} words`, () => {
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_LONG_DESCRIPTION + 1).keys()].join(' '))).toBe(LONG_DESCRIPTION_SC)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_LONG_DESCRIPTION).keys()].join(' '))).toBe(0)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_LONG_DESCRIPTION + 1).keys()].join(','))).toBe(LONG_DESCRIPTION_SC)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_LONG_DESCRIPTION + 1).keys()].join('\t'))).toBe(LONG_DESCRIPTION_SC)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_LONG_DESCRIPTION + 1).keys()].join('\n'))).toBe(LONG_DESCRIPTION_SC)
})
