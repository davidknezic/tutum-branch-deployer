import Bacon from 'baconjs'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

export default function createTagOrTakeExisting(event, tutum) {
  return Bacon.once(event)
    .flatMap((event) => {
      return Bacon.combineTemplate({
        branch: branch,
        image: Bacon.fromPromise(tutum.getImage(process.env.TUTUM_IMAGE)),
        build_settings: Bacon.fromPromise(tutum.allBuildSettings(process.env.TUTUM_IMAGE))
      })
    })

    .flatMap((data) => {
      let branches = data.build_settings.map((bs) => bs.branch)

      if (branches.indexOf(data.branch) < 0) {
        debug(`${'Yeah'.green}! We are going to create a new tag, 'cause there is none yet.`)
        return data
      } else {
        debug(`${'Oh wait...'.red} A tag already exists. Nothing to do here.`)
        return Bacon.never()
      }
    })

    .flatMap((data) => {
      debug(`Now updating the image with the new branch/tag...`)
      debug(`Branch is ${data.branch.cyan} and tag is ${slug(data.branch).cyan}`)

      let build_settings = []
      data.build_settings.forEach((bs) => build_settings.push(bs))
      build_settings.push({
        tag: slug(data.branch),
        branch: data.branch,
        dockerfile: '/',
        autobuild: true
      })

      let payload = {
        build_source: {
          repository: data.image.build_source.repository,
          build_settings: build_settings
        }
      }

      debug(`Updating ${data.image.resource_uri.cyan}.`)

      return Bacon.combineTemplate({
        branch: data.branch,
        image: data.image,
        build_settings: build_settings,
        creation: Bacon.fromPromise(tutum.updateImage({ uri: data.image.resource_uri }, payload))
      })
    })
}
