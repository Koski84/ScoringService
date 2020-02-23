const service = require('./service')

exports.getScore = async function (req, res) {
  const advert = req.body

  try {
    if (!advert.type) {
      throw Error('where is my advert?')
    }

    const score = service.getScore(advert)
    advert.score = score
    res.status(200).json({ status: 200, data: advert, message: 'Advert succesfully scored' })
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message })
  }
}
