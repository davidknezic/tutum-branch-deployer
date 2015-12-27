import Bacon from 'baconjs'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

export default function startServiceOrTakeRunning(event, tutum, tutumStream) {
  return Bacon.once(event)
    .flatMap((data) => {
      return Bacon.combineTemplate({
        branch: data.branch,
        image: data.image,
        build_settings: data.build_settings,
        create: data.create,
        start: Bacon.fromPromise(tutum.startService({ uri: data.create.resource_uri }))
      })
    })

    .flatMap((data) => {
      let started = tutumStream
        .doAction((event) => debug(`OMG, there's a new tutum event for ${event.resource_uri.cyan}`))

        .filter((event) => {
          return event.resource_uri === data.create.resource_uri
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
        create: data.create,
        started: started
      })
    })
}
