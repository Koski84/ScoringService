const NO_IMAGES = -10;
const HD_IMAGE = +20
const OTHER_IMAGE = +10;

class AdvertScore {
  constructor() {
    if (this.constructor == AdvertScore)
      throw Error('Abstract classes canot be instantiated');
  }
  
  score() {
    let currentScore = 0;
  }

  evalImages(arrayOfImages) {
    if (arrayOfImages.length == 0)
      return NO_IMAGES;

    return arrayOfImages
      .map(({quality}) => (quality == 'HD') ? HD_IMAGE : OTHER_IMAGE)
      .reduce((acc, current) => acc + current);
  }

  evalDescription(description) {
    if (!description)
      return 0;
    
    this.evalDescriptionLength(description);

    return 5;
  }

  evalDescriptionLength(description) {
    throw new Error("Must be implemented in concrete classes");
  }
}

exports.AdvertScore = AdvertScore;
exports.const = {NO_IMAGES, HD_IMAGE, OTHER_IMAGE};