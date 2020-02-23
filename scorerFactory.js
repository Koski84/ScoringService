const vehiculoScore = require('./template/vehiculo-score')
const pisoScore = require('./template/piso-score')
const chaletScore = require('./template/chalet-score')
const frigorificoScore = require('./template/frigorifico-score')

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

module.exports = scorerFactory
