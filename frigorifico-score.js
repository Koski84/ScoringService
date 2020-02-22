const { AdvertScore } = require('./advert-score')

class FrigorificoScore extends AdvertScore {
  async evalCompletenessAsync (advert) {
    if (!advert.height) {
      return false
    }

    return super.evalCompletenessAsync(advert)
  }

  evalDescriptionLength () {
    return 0
  }
}

exports.FrigorificoScore = FrigorificoScore
