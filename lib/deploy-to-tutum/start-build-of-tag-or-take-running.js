import Bacon from 'baconjs'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

export default function startBuildOfTagOrTakeRunning(event, tutum, tutumStream) {
  return Bacon.once(event)
    .doAction((data) => debug(`Going to start build of ${slug(data.branch).cyan} tag...`))

    .flatMap((data) => {
      return Bacon.combineTemplate({
        branch: data.branch,
        image: data.image,
        build_settings: data.build_settings,
        build: Bacon.fromPromise(tutum.buildTag(data.image.name, slug(data.branch)))
      })
    })

    .doAction((data) => debug(`Going to listen to events for ${data.build.resource_uri.cyan} only...`))

    .flatMap((data) => {

      let built = tutumStream
        .doAction((event) => debug(`OMG, there's a new tutum event for ${event.resource_uri.cyan}`))

        .filter((event) => {
          return event.resource_uri === data.build.resource_uri
        })

        .doAction((event) => debug(`Our event has the state ${event.state.cyan}`))

        .filter((event) => ['Success', 'Failed'].indexOf(event.state) > -1)

        .doAction((event) => debug(`${'Yeah'.green}! It's one for us with the status ${event.state.cyan}`))

        .flatMap((event) => Bacon.once(event.state === 'Success'))

        .first()

      return Bacon.combineTemplate({
        branch: data.branch,
        image: data.image,
        build_settings: data.build_settings,
        successfully_built: built
      })
    })

    .filter((data) => {
      if (!data.successfully_built) {
        debug(`${'Failed'.bgRed.white} building image!`)
        return false
      } else {
        return true
      }
    })
}
