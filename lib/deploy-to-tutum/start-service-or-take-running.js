import Bacon from 'baconjs'
import R from 'ramda'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

let isSuccessOrFailed = R.contains(R.__, ['Running', 'Stopped'])
let isSuccess = R.equals('Running')
let isStarting = R.contains(R.__, ['Starting', 'Redeploying'])

export default function startServiceOrTakeRunning(service, tutum, tutumStream) {
  return Bacon.once(service)
    .flatMap((service) => {
      if (isStarting(service.state)) {
        debug(`Service ${service.resource_uri.cyan} is starting already.`)

        return service
      }

      debug(`Starting service ${service.resource_uri.cyan}.`)

      return startService(service, tutum)
    })
    .flatMap((service) => getServiceStartFinished(service, tutumStream))
}

function startService(service, tutum) {
  return Bacon.fromPromise(tutum.startService({
    uri: service.resource_uri
  }))
}

function getServiceStartFinished(service, tutumStream) {
  return tutumStream
    .filter((event) => event.resource_uri == service.resource_uri)
    .doAction((event) => debug(`Got an event for ${event.resource_uri.cyan} and state ${event.state.cyan}.`))
    .filter((event) => isSuccessOrFailed(event.state))
    // Apps sometimes crash on start, even after Tutum signalled success.
    // This bit waits for a potential failure, but only for limited time.
    .debounce(process.env.TUTUM_WAIT_TIME || 10000)
    .flatMap((event) => Bacon.once(isSuccess(event.state)))
    .doAction((isSuccessful) => debug(`Service start ${isSuccessful ? 'is'.green : 'is not'.red} successful.`))
    .flatMap((isSuccessful) => {
      if (!isSuccessful) return Bacon.Error('Service start failed')
      return true
    })
    .first()
}
