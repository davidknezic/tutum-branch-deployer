import Bacon from 'baconjs'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

export default function createServiceOrTakeExisting(push, image, buildSetting, tutum, createServiceHook) {
  return Bacon.fromNodeCallback(createServiceHook, push, image, buildSetting)
    .flatMap((service) => {
      return getService(service.name, tutum)
        .doAction((service) => debug(`Service with name ${service.name.cyan} already exists.`))
        .flatMapError((error) => {
          debug(`Creating a new service named ${service.name.cyan}.`)
          return createService(service, tutum)
        })
    })
}

function getService(name, tutum) {
  return Bacon.fromPromise(tutum.getService({ name: name }))
}

function createService(service, tutum) {
  return Bacon.fromPromise(tutum.createService(service))
}
