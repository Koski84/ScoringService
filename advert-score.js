const NO_IMAGES = -10;
const HD_IMAGE = 20;
const OTHER_IMAGE = 10;
const NO_DESC = 0;
const DESC_AVAILABLE = 5;
const KEYWORD = 5;

class AdvertScore {
  constructor() {
    if (this.constructor == AdvertScore)
      throw Error('Abstract classes canot be instantiated');

    this.KEYWORDS_ARRAY = [ 'Luminoso', 'Nuevo', 'Cuidado', 'Fabuloso', 'Único', 'Excepcional', 'Ocasión' ];
  }
  
  score() {
    let currentScore = 0;

    // TODO
  }

  evalImages(arrayOfImages) {
    if (!arrayOfImages || arrayOfImages.length == 0)
      return NO_IMAGES;

    return arrayOfImages
      .map(({quality}) => (quality == 'HD') ? HD_IMAGE : OTHER_IMAGE)
      .reduce((acc, current) => acc + current);
  }

  evalDescription(description) {
    if (!description)
      return NO_DESC;
    
    let score = DESC_AVAILABLE;
    score += this.evalDescriptionLength(description);

    return score;
  }

  evalDescriptionLength(description) {
    throw new Error("Must be implemented in concrete classes");
  }

  evalKeywords(description) {
    return this.KEYWORDS_ARRAY
      .filter(kw => new RegExp(`\\b${kw}\\b`, 'gi').test(description))
      .length * KEYWORD;
  }
}

exports.AdvertScore = AdvertScore;
exports.scoring = { NO_IMAGES, HD_IMAGE, OTHER_IMAGE, NO_DESC, DESC_AVAILABLE, KEYWORD };