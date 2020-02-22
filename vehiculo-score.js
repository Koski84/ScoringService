const { AdvertScore } = require('./advert-score');

class VehiculoScore extends AdvertScore {
  evalCompleteness(advert) {
    if (!advert.description || !advert.km || !advert.color || !advert.fabricant)
      return false;

    return super.evalCompleteness(advert);
  }

  evalDescriptionLength() {
    return 0;
  }
}

exports.VehiculoScore = VehiculoScore;