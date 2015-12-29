import Bacon from 'baconjs'
import R from 'ramda'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

let isSuccessOrFailed = R.contains(R.__, ['Success', 'Failed'])
let isSuccess = R.equals('Success')
let isBuilding = R.equals('Building')

export default function startBuildOrTakeRunning(buildSetting, tutum, tutumStream) {
  return Bacon.once(buildSetting)
    .flatMap((buildSetting) => {
      if (isBuilding(buildSetting.state)) {
        debug(`There's a build for ${buildSetting.resource_uri.cyan} running already.`)

        return buildSetting
      }

      debug(`Starting a new build of ${buildSetting.resource_uri.cyan}.`)

      return startBuild(buildSetting, tutum)
    })
    .flatMap((buildSetting) => getBuildFinished(buildSetting, tutumStream))
}

function startBuild(buildSetting, tutum) {
  return Bacon.fromPromise(tutum.buildTag({
    uri: buildSetting.resource_uri
  }))
}

function getBuildFinished(buildSetting, tutumStream) {
  return tutumStream
    .filter((event) => event.resource_uri == buildSetting.resource_uri)
    .doAction((event) => debug(`Got an event for ${event.resource_uri.cyan} and state ${event.state.cyan}.`))
    .filter((event) => isSuccessOrFailed(event.state))
    .flatMap((event) => Bacon.once(isSuccess(event.state)))
    .doAction((isSuccessful) => debug(`Build ${isSuccessful ? 'is'.green : 'is not'.red} successful.`))
    .first()
}
