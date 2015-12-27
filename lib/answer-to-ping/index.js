import Bacon from 'baconjs'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

export default function answerToPing(event) {
  return Bacon.once(event)
    .onValue((event) => {
      debug(`Event hook ${event.id.toString().cyan} pinged with ${event.payload.zen.cyan}`)
    })
}
