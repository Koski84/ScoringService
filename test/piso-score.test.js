const { PisoScore, scoring } = require('../piso-score')
const { WORD_COUNT_LONG_DESCRIPTION, LONG_DESCRIPTION_SC, WORD_COUNT_VERY_LONG_DESCRIPTION, VERY_LONG_DESCRIPTION_SC } = scoring

var sut = new PisoScore()

test('evalCompleteness is true if advert has description, area and image (base advert constraint)', () => {
  sut.evalCompletenessAsync({ description: 'Muy céntrico', size: '80', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeTruthy())
  sut.evalCompletenessAsync({ description: '', size: '80', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompletenessAsync({ description: 'Muy céntrico', size: '', images: [{ quality: 'HD' }] }).then(value => expect(value).toBeFalsy())
  sut.evalCompletenessAsync({ description: 'Muy céntrico', size: '80', images: [] }).then(value => expect(value).toBeFalsy())
})

test('getScoreAsync works', () => {
  expect(() => sut.getScoreAsync({ description: 'Al lado del Pollo Express!' })).not.toThrow()
})

test(`evalDescriptionLength scores ${LONG_DESCRIPTION_SC} points if description is ${WORD_COUNT_LONG_DESCRIPTION}+ words`, () => {
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_LONG_DESCRIPTION).keys()].join(' '))).toBe(LONG_DESCRIPTION_SC)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_LONG_DESCRIPTION - 1).keys()].join(' '))).toBe(0)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_LONG_DESCRIPTION).keys()].join(','))).toBe(LONG_DESCRIPTION_SC)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_LONG_DESCRIPTION).keys()].join('\t'))).toBe(LONG_DESCRIPTION_SC)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_LONG_DESCRIPTION).keys()].join('\n'))).toBe(LONG_DESCRIPTION_SC)
})

test(`evalDescriptionLength scores ${VERY_LONG_DESCRIPTION_SC} points if description is ${WORD_COUNT_VERY_LONG_DESCRIPTION}+ words`, () => {
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_VERY_LONG_DESCRIPTION).keys()].join(' '))).toBe(VERY_LONG_DESCRIPTION_SC)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_VERY_LONG_DESCRIPTION - 1).keys()].join(' '))).toBe(LONG_DESCRIPTION_SC)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_VERY_LONG_DESCRIPTION).keys()].join(','))).toBe(VERY_LONG_DESCRIPTION_SC)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_VERY_LONG_DESCRIPTION).keys()].join('\t'))).toBe(VERY_LONG_DESCRIPTION_SC)
  expect(sut.evalDescriptionLength([...Array(WORD_COUNT_VERY_LONG_DESCRIPTION).keys()].join('\n'))).toBe(VERY_LONG_DESCRIPTION_SC)
})
