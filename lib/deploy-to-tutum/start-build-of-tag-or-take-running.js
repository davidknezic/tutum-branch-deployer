import Bacon from 'baconjs'
import R from 'ramda'

let isSuccessOrFailed = R.contains(R.__, ['Success', 'Failed'])
let isSuccess = R.equals('Success')
let isBuilding = R.equals('Building')

export default function startBuildOfTagOrTakeRunning(buildSetting, tutum, tutumStream) {
  return Bacon.once(buildSetting)
    .flatMap((buildSetting) => {
      if (isBuilding(buildSetting.state)) {
        return buildSetting
      }

      return startBuild(buildSetting, tutum)
    })
    .flatMap((buildSetting) => {
      return getBuildFinished(buildSetting, tutumStream)
    })
}

function startBuild(buildSetting, tutum) {
  return Bacon.fromPromise(tutum.buildTag({
    uri: buildSetting.resource_uri
  }))
}

function getBuildFinished(buildSetting, tutumStream) {
  return tutumStream
    .filter((event) => event.resource_uri == buildSetting.resource_uri)
    .filter((event) => isSuccessOrFailed(event.state))
    .flatMap((event) => Bacon.once(isSuccess(event.state))
    .first()
}
