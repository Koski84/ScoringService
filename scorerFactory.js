const vehiculoScore = require('./vehiculo-score')
const pisoScore = require('./piso-score')
const chaletScore = require('./chalet-score')
const frigorificoScore = require('./frigorifico-score')

const scorerFactory = ({ type }) => {
  switch (type) {
    case 'PISO':
      return new pisoScore.PisoScore()
    case 'VEHICULO':
      return new vehiculoScore.VehiculoScore()
    case 'CHALET':
      return new chaletScore.ChaletScore()
    case 'FRIGORIFICO':
      return new frigorificoScore.FrigorificoScore()
  }
}

exports.scorerFactory = scorerFactory
