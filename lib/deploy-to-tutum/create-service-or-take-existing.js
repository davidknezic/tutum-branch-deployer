import Bacon from 'baconjs'
import clone from 'clone'
import slug from 'slug'
import colors from 'colors'
import serviceTemplate from '../service.json'

let debug = require('debug')('tutum-tagger')

export default function createServiceOrTakeExisting(event, tutum) {
  return Bacon.once(event)
    .flatMap((data) => {
      let service = clone(serviceTemplate, false)

      service.image = process.env.TUTUM_IMAGE
      service.name = slug(data.branch)
      service.container_envvars.push({
        key: 'VIRTUAL_PATH',
        value: slug(data.branch)
      })

      return Bacon.combineTemplate({
        branch: data.branch,
        image: data.image,
        build_settings: data.build_settings,
        create: Bacon.fromPromise(tutum.createService(service))
      })
    })

    .doAction((data) => debug(`Service ${data.create.resource_uri.cyan} created!`))
}
