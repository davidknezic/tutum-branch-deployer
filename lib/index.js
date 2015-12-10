import crypto from 'crypto'
import colors from 'colors'
import express from 'express'
import bodyParser from 'body-parser'

let debug = require('debug')('tutum-tagger')

let app = express()

app.use(bodyParser.json({
  verify: function (req, res, buf) {
    req.rawBody = buf
  }
}))
app.use(bodyParser.urlencoded({
  extended: true
}))

function parseSignature(string) {
  let match = string.match(/(\w+)=(\w+)/)

  return {
    type: match[1],
    hash: match[2]
  }
}

app.post('/postreceive', function (req, res) {
  let delivery = {
    event: req.header('X-Github-Event'),
    signature: parseSignature(req.header('X-Hub-Signature')),
    id: req.header('X-Github-Delivery')
  }

  debug(`Received ${delivery.event.cyan} event`)
  debug(`Going to use ${delivery.signature.type.cyan} algorithm`)

  let hash = crypto
    .createHmac(delivery.signature.type, process.env.EVENT_SECRET)
    .update(req.rawBody)
    .digest('hex') || 'null'

  if (delivery.signature.hash != hash) {
    debug(`Calculated signature ${hash.cyan} does not match with delivered one ${delivery.signature.hash.cyan}`)

    return res.status(403).json({
      error: 'signature does not match',
      expected: delivery.signature.hash,
      calculated: hash
    })
  }

  if (delivery.event == 'ping') {
    debug(`Event hook ${req.body.hook_id.toString().cyan} pinged with ${req.body.zen.cyan}`)

    return res.json({
      success: 'ping successful',
      hook_id: req.body.hook_id,
      zen: req.body.zen
    })
  }

  res.send({})
})

export default app
