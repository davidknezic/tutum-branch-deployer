import Bacon from 'baconjs'
import WebSocket from 'ws'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

const WS_URL = 'stream.tutum.co/v1/events'

export default function createSocket(options) {
  let auth = `${options.username}:${options.apikey}`
  let ws = new WebSocket(`wss://${auth}@${WS_URL}`)

  ws.on('open', function () {
    debug(`Successfully ${'connected'.bgGreen.black} to Tutum's Stream API`)
  })

  return Bacon.fromEvent(ws, 'message')
    .map((message) => JSON.parse(message))
}
