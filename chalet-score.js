const { AdvertScore } = require('./advert-score')

const WORD_COUNT_LONG_DESCRIPTION = 50
const LONG_DESCRIPTION_SC = 20

class ChaletScore extends AdvertScore {
  evalCompleteness (advert) {
    if (!advert.description || !advert.size) {
      return false
    }

    return super.evalCompleteness(advert)
  }

  evalDescriptionLength (description) {
    const wc = description.match(/\w+/g).length

    return wc > WORD_COUNT_LONG_DESCRIPTION ? LONG_DESCRIPTION_SC : 0
  }
}

exports.ChaletScore = ChaletScore
exports.scoring = { WORD_COUNT_LONG_DESCRIPTION, LONG_DESCRIPTION_SC }
