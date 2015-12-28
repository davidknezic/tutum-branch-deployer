import http from 'http'
import createHandler from 'github-webhook-handler'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

export default function createApp(options) {

  let handler = createHandler({
    path: '/postreceive',
    secret: options.secret
  })

  let host = options.host
  let port = options.port

  http.createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404
      res.end('no such location')
    })
  }).listen(port, host, function () {
    debug(`GitHub webhook server ${'running'.black.bgGreen} on ${`http://${host}:${port}`.cyan}`)
  })

  handler.on('error', function (err) {
    debug(`Failed with error: ${err.message.cyan}`)
  })

  return handler
}
