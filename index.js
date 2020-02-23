const express = require('express')
const bodyParser = require('body-parser')
const scorerFactory = require('./scorerFactory')

const app = express()
app.use(bodyParser.json())

app.get('/score', (req, res) => {
  const advert = req.body

  console.log('scoring request received. Type: ' + advert.type)
  const scorer = scorerFactory(advert)

  const scorePromise = scorer.getScoreAsync(advert)
  scorePromise.then(value => {
    console.log('score: ' + value)
    res.send(value.toString())
  })
})

app.listen(9010, () => {
  console.debug('Listening port 9010')
})
