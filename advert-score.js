const NO_IMAGES_SC = -10
const HD_IMAGE_SC = 20
const OTHER_IMAGE_SC = 10
const NO_DESC_SC = 0
const DESC_AVAILABLE_SC = 5
const KEYWORD_SC = 5
const COMPLETENESS_SC = 40

class AdvertScore {
  constructor () {
    if (this.constructor === AdvertScore) {
      throw Error('Abstract classes canot be instantiated')
    }

    this.KEYWORDS_ARRAY = ['Luminoso', 'Nuevo', 'Cuidado', 'Fabuloso', 'Único', 'Excepcional', 'Ocasión']
  }

  getScore (advert) {
    let currentScore = 0

    const { images, description } = advert
    currentScore += this.evalImages(images)
    currentScore += this.evalDescription(description)
    currentScore += this.evalKeywords(description)

    if (this.evalCompleteness(advert)) {
      currentScore += COMPLETENESS_SC
    }

    return currentScore
  }

  evalImages (arrayOfImages) {
    if (this.hasImages(arrayOfImages) === false) {
      return NO_IMAGES_SC
    }

    return arrayOfImages
      .map(({ quality }) => (quality === 'HD') ? HD_IMAGE_SC : OTHER_IMAGE_SC)
      .reduce((acc, current) => acc + current)
  }

  hasImages (arrayOfImages) {
    if (!arrayOfImages || arrayOfImages.length === 0) {
      return false
    }

    return true
  }

  evalDescription (description) {
    if (!description) {
      return NO_DESC_SC
    }

    let score = DESC_AVAILABLE_SC
    score += this.evalDescriptionLength(description)

    return score
  }

  evalDescriptionLength (description) {
    throw new Error('Must be implemented in concrete classes')
  }

  evalKeywords (description) {
    return this.KEYWORDS_ARRAY
      .filter(kw => new RegExp(`\\b${kw}\\b`, 'gi').test(description))
      .length * KEYWORD_SC
  }

  evalCompleteness (advert) {
    if (!advert) {
      return false
    }

    return this.hasImages(advert.images)
  }
}

exports.AdvertScore = AdvertScore
exports.scoring = {
  NO_IMAGES_SC,
  HD_IMAGE_SC,
  OTHER_IMAGE_SC,
  NO_DESC_SC,
  DESC_AVAILABLE_SC,
  KEYWORD_SC,
  COMPLETENESS_SC
}
