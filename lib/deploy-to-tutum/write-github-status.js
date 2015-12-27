import Bacon from 'baconjs'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

export default function writeGitHubStatus(event) {
  return Bacon.once(event)
}
