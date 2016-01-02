import Bacon from 'baconjs'
import colors from 'colors'
import takeNewBranchPushes from './take-new-branch-pushes'
import createImageOrTakeExisting from './create-image-or-take-existing'
import createTagOrTakeExisting from './create-tag-or-take-existing'
import startBuildOrTakeRunning from './start-build-or-take-running'
import createServiceOrTakeExisting from './create-service-or-take-existing'
import startServiceOrTakeRunning from './start-service-or-take-running'
import writeGitHubStatus from './write-github-status'

let debug = require('debug')('tutum-tagger')

export default function deployToTutum(pushEvent, tutum, tutumStream, github) {
  return Bacon.once(pushEvent)
    .flatMap((pushEvent) => takeNewBranchPushes(pushEvent.payload))
    .doAction((push) => debug(`Push ${'does'.green} create a new branch.`))
    .flatMap((push) => {
      return writeGitHubStatus({ state: 'pending' }, push.repository, push.commit.id, github)
        .flatMap(() => createImageOrTakeExisting(process.env.TUTUM_IMAGE, push.repository, tutum))
        .doAction((image) => debug(`Image ${image.resource_uri.cyan} selected.`))
        .flatMap((image) => {
          return createTagOrTakeExisting(image, push.branch, tutum)
            .doAction((buildSetting) => debug(`Build setting ${buildSetting.resource_uri.cyan} selected.`))
            .flatMap((buildSetting) => {
              return startBuildOrTakeRunning(buildSetting, tutum, tutumStream)
                .doAction((isSuccessful) => debug(`Build ${isSuccessful ? 'is'.green : 'is not'.red} successful.`))
                .flatMap((isSuccessful) => {
                  if (!isSuccessful) return Bacon.never()
                  return createServiceOrTakeExisting(image, buildSetting, tutum)
                    .doAction((service) => debug(`Service ${service.resource_uri.cyan} selected.`))
                    .flatMap((service) => {
                      return startServiceOrTakeRunning(service, tutum, tutumStream)
                        .doAction((isSuccessful) => debug(`Service start ${isSuccessful ? 'is'.green : 'is not'.red} successful.`))
                        .flatMap((isSuccessful) => {
                          return writeGitHubStatus({
                            state: 'success'
                          }, push.repository, push.commit.id, github)
                        })
                    })
                })
            })
        })
        .flatMapError((error) => {
          return writeGitHubStatus({ state: 'failure' }, push.repository, push.commit.id, github)
            .flatMap(() => Bacon.Error(error))
        })
    })
    .doError((error) => debug(`Push ${'failed'.red} with error ${error}.`))
}
