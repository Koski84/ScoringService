const { AdvertScore } = require('./advert-score')

const WORD_COUNT_LONG_DESCRIPTION = 20
const LONG_DESCRIPTION_SC = 10
const WORD_COUNT_VERY_LONG_DESCRIPTION = 50
const VERY_LONG_DESCRIPTION_SC = 30

class PisoScore extends AdvertScore {
  async evalCompleteness (advert) {
    if (!advert.description || !advert.size) {
      return false
    }

    return super.evalCompleteness(advert)
  }

  evalDescriptionLength (description) {
    const wc = description.match(/\w+/g).length

    if (wc >= WORD_COUNT_VERY_LONG_DESCRIPTION) {
      return VERY_LONG_DESCRIPTION_SC
    }

    if (wc >= WORD_COUNT_LONG_DESCRIPTION) {
      return LONG_DESCRIPTION_SC
    }

    return 0
  }
}

exports.PisoScore = PisoScore
exports.scoring = { WORD_COUNT_LONG_DESCRIPTION, LONG_DESCRIPTION_SC, WORD_COUNT_VERY_LONG_DESCRIPTION, VERY_LONG_DESCRIPTION_SC }
