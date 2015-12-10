import crypto from 'crypto'
import colors from 'colors'
import express from 'express'
import bodyParser from 'body-parser'

let debug = require('debug')('tutum-tagger')

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post('/postreceive', function (req, res) {
  let delivery = {
    event: req.header('X-Github-Event'),
    signature: req.header('X-Hub-Signature'),
    delivery: req.header('X-Github-Delivery')
  }

  debug(`Received ${delivery.event.cyan} event`)

  let hmac = crypto.createHmac('sha256', process.env.EVENT_SECRET)
  hmac.update(req.body)

  let signature = hmac.read()

  if (delivery.signature == signature) {
    debug(`Calculated signature ${signature.cyan} do not match with delivered one ${delivery.signature.cyan}`)
    res.status(403).send(`Calculated signature ${signature} do not match with delivered one ${delivery.signature}`)
    return
  }

  if (delivery.event == 'ping') {
    debug(`Event hook ${req.body.hook_id.toString().cyan} pinged with ${req.body.zen.cyan}`)
    res.send(`Event hook ${req.body.hook_id} pinged with ${req.body.zen}`)
    return
  }

  res.send({})
})

export default app
