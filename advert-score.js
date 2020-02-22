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

  async getScoreAsync (advert) {
    const { images, description } = advert

    const imagesScorePromise = this.evalImagesAsync(images)
    const descriptionScorePromise = this.evalDescriptionAsync(description)
    const keywordsScorePromise = this.evalKeywordsAsync(description)
    const isCompletePromise = this.evalCompletenessAsync(advert)

    return await imagesScorePromise 
      + await descriptionScorePromise 
      + await keywordsScorePromise 
      + (await isCompletePromise ? COMPLETENESS_SC : 0)
  }

  async evalImagesAsync (arrayOfImages) {
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

  async evalDescriptionAsync (description) {
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

  async evalKeywordsAsync (description) {
    return this.KEYWORDS_ARRAY
      .filter(kw => new RegExp(`\\b${kw}\\b`, 'gi').test(description))
      .length * KEYWORD_SC
  }

  async evalCompletenessAsync (advert) {
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
