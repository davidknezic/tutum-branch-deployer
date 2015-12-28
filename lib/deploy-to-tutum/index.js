import Bacon from 'baconjs'
import takeNewBranchPushes from './take-new-branch-pushes'
import createImageOrTakeExisting from './take-image-or-take-existing'
import createTagOrTakeExisting from './create-tag-or-take-existing'
import startBuildOfTagOrTakeRunning from './start-build-of-tag-or-take-running'
import createServiceOrTakeExisting from './create-service-or-take-existing'
import startServiceOrTakeRunning from './start-service-or-take-running'
import writeGitHubStatus from './write-github-status'

export default function deployToTutum(pushEvent, tutum, tutumStream, github) {
  return Bacon.once(pushEvent)
    .flatMap((pushEvent) => takeNewBranchPushes(pushEvent.payload))
    .flatMap((push) => {
      return createImageOrTakeExisting(process.env.TUTUM_IMAGE, push.repository, tutum)
        .flatMap((image) => {
          return createTagOrTakeExisting(image, push.branch, tutum)
            .flatMap((buildSetting) => {
              return startBuildOfTagOrTakeRunning(buildSetting, tutum, tutumStream)
            })
        })
    })
}
