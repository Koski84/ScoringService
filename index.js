require('dotenv').config('.env')
const express = require('express')
const bodyParser = require('body-parser')
const controller = require('./controller')

const app = express()
app.use(bodyParser.json())
app.get('/score', controller.getScore)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`)
})
