const scorerFactory = require('./scorerFactory')

exports.getScore = async function (advert) {
  console.log('scoring request received. Type: ' + advert.type)
  const scorer = scorerFactory(advert)

  const score = await scorer.getScoreAsync(advert)
  console.log('score: ' + score)
  return score
}
