const { AdvertScore } = require('./advert-score');

const WORD_COUNT_FOR_LONG_DESCRIPTION = 50;
const LONG_DESCRIPTION_SC = 20;

class ChaletScore extends AdvertScore {
  evalCompleteness(advert) {
    if (!advert.description || !advert.size)
      return false;

    return super.evalCompleteness(advert);
  }

  evalDescriptionLength(description) {
    return LONG_DESCRIPTION_SC;
    // TODO Word Count
  }
}

exports.ChaletScore = ChaletScore;
exports.scoring = { WORD_COUNT_FOR_LONG_DESCRIPTION, LONG_DESCRIPTION_SC };