require('dotenv').config('.env')
const express = require('express')
const bodyParser = require('body-parser')
const scorerFactory = require('./scorerFactory')

const app = express()
app.use(bodyParser.json())

app.get('/score', async (req, res) => {
  const advert = req.body

  if (!advert.type) {
    res.status(400).send('where is my advert?')
    return
  }

  console.log('scoring request received. Type: ' + advert.type)
  const scorer = scorerFactory(advert)

  const scorePromise = scorer.getScoreAsync(advert)
  scorePromise.then(value => {
    console.log('score: ' + value)
    advert.score = value
    res.status(200).json({ status: 200, data: advert, message: 'Advert succesfully scored' })
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Listening port ${process.env.PORT}`)
})
