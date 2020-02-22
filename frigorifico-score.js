const { AdvertScore } = require('./advert-score')

class FrigorificoScore extends AdvertScore {
  evalCompleteness (advert) {
    if (!advert.height) {
      return false
    }

    return super.evalCompleteness(advert)
  }

  evalDescriptionLength () {
    return 0
  }
}

exports.FrigorificoScore = FrigorificoScore
