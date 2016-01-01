import Bacon from 'baconjs'
import R from 'ramda'
import clone from 'clone'
import slug from 'slug'
import colors from 'colors'
import serviceTemplate from '../../service.json'

let debug = require('debug')('tutum-tagger')

export default function createServiceOrTakeExisting(image, buildSetting, tutum) {
  return listAllServices(tutum)
    .flatMap((services) => {
      let findService = R.find(R.propEq('image_name', `${image.name}:${buildSetting.tag}`))
      let service = findService(services)

      if (service) {
        return service
      }

      let options = clone(serviceTemplate, false)

      options.image = `${image.name}:${buildSetting.tag}`
      options.name = slug(buildSetting.branch)
      options.container_envvars.push({
        key: 'VIRTUAL_PATH',
        value: slug(buildSetting.branch)
      })

      return createService(options, tutum)
    })
}

function listAllServices(tutum) {
  return Bacon.fromPromise(tutum.listServices())
}

function createService(options, tutum) {
  return Bacon.fromPromise(tutum.createService(options))
}
