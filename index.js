import http from 'http'
import colors from 'colors'
import app from './lib'

let debug = require('debug')('tutum-tagger')

let status = 'running'
let host = '0.0.0.0'
let port = 1337

http.createServer(app).listen(port, host, function () {
  debug(`API server ${status.black.bgGreen} on ${`http://${host}:${port}`.cyan}`)
})
