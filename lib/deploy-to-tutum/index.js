import Bacon from 'baconjs'
import colors from 'colors'
import takeNewBranchPushes from './take-new-branch-pushes'
import createTagOrTakeExisting from './create-tag-or-take-existing'
import startBuildOfTagOrTakeRunning from './start-build-of-tag-or-take-running'
import createServiceOrTakeExisting from './create-service-or-take-existing'
import startServiceOrTakeRunning from './start-service-or-take-running'
import writeGitHubStatus from './write-github-status'

let debug = require('debug')('tutum-tagger')

export default function deployToTutum(event, tutum, tutumStream, github) {
  return Bacon.once(event)
    .flatMap((event) => takeNewBranchPushes(event))
    .flatMap((event) => createTagOrTakeExisting(event, tutum))
    .flatMap((event) => startBuildOfTagOrTakeRunning(event, tutum, tutumStream))
    .flatMap((event) => createServiceOrTakeExisting(event, tutum))
    .flatMap((event) => startServiceOrTakeRunning(event, tutum, tutumStream))
    .flatMap((event) => writeGitHubStatus(event, github))
}
