const { AdvertScore } = require('./advert-score')

class VehiculoScore extends AdvertScore {
  async evalCompletenessAsync (advert) {
    if (!advert.description || !advert.km || !advert.color || !advert.fabricant) {
      return false
    }

    return super.evalCompletenessAsync(advert)
  }

  evalDescriptionLength () {
    return 0
  }
}

exports.VehiculoScore = VehiculoScore
