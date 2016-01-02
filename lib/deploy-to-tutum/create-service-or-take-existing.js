import Bacon from 'baconjs'
import R from 'ramda'
import clone from 'clone'
import slug from 'slug'
import serviceTemplate from '../../service.json'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

export default function createServiceOrTakeExisting(image, buildSetting, tutum) {
  return listAllServices(tutum)
    .flatMap((services) => {
      let imageWithTag = `${image.name}:${buildSetting.tag}`
      let findService = R.find(R.propEq('image_name', imageWithTag))
      let service = findService(services.objects)

      if (service) {
        debug(`Service based on ${imageWithTag.cyan} already exists.`)
        return service
      }

      let options = clone(serviceTemplate, false)

      options.image = imageWithTag
      options.name = slug(buildSetting.branch)
      options.container_envvars.push({
        key: 'VIRTUAL_PATH',
        value: slug(buildSetting.branch)
      })

      debug(`Creating a new service based on ${imageWithTag.cyan}.`)

      return createService(options, tutum)
    })
}

function listAllServices(tutum) {
  return Bacon.fromPromise(tutum.listServices())
}

function createService(options, tutum) {
  return Bacon.fromPromise(tutum.createService(options))
}
