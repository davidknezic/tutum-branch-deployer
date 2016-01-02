import Bacon from 'baconjs'
import R from 'ramda'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

let descriptions = {
  'pending': 'App is being deployed',
  'success': 'Deployment of the app succeeded',
  'error': 'Deployment of the app errored',
  'failure': 'Deployment of the app failed'
}

let states = R.keys(descriptions)
let isValidState = R.contains(R.__, states)

export default function writeGitHubStatus(status, repository, sha, github) {
  if (!isValidState(status.state)) {
    throw new Error(`${status.state} is an invalid state. must be one of: ${states.join(', ')}`)
  }

  return createStatus(status, repository, sha, github)
    .doAction((result) => debug(`Status with id ${result.id} ${'successfully'.green} written.`))
}

function createStatus(status, repository, sha, github) {
  return Bacon.fromNodeCallback(github.statuses.create, {
    user: repository.owner.name,
    repo: repository.name,
    sha: sha,
    state: status.state,
    target_url: status.url,
    description: descriptions[status.state],
    context: 'autodeploy/tutum'
  })
}
