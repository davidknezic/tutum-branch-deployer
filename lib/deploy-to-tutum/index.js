import Bacon from 'baconjs'
import takeNewBranchPushes from './take-new-branch-pushes'
import createImageOrTakeExisting from './create-image-or-take-existing'
import createTagOrTakeExisting from './create-tag-or-take-existing'
import startBuildOrTakeRunning from './start-build-or-take-running'

export default function deployToTutum(pushEvent, tutum, tutumStream, github) {
  return Bacon.once(pushEvent)
    .flatMap((pushEvent) => takeNewBranchPushes(pushEvent.payload))
    .flatMap((push) => {
      return createImageOrTakeExisting(process.env.TUTUM_IMAGE, push.repository, tutum)
        .flatMap((image) => {
          return createTagOrTakeExisting(image, push.branch, tutum)
            .flatMap((buildSetting) => {
              return startBuildOrTakeRunning(buildSetting, tutum, tutumStream)
            })
        })
    })
}
