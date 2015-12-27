import Bacon from 'baconjs'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

export default function takeNewBranchPushes(pushPayload) {
  return Bacon.once(pushPayload)
    .filter((pushPayload) => {
      let keep = pushPayload.created

      if (keep) {
        debug(`${'Keep:'.green} git branch ${pushPayload.ref.cyan} was created.`)
      } else {
        debug(`${'Skip:'.red} No new git branch was created.`)
      }

      return keep
    })
    .flatMap((pushPayload) => {
      const GIT_BRANCH_REGEX = /refs\/heads\/(.+)/

      let matches = pushPayload.ref.match(GIT_BRANCH_REGEX)

      if (matches && matches.length === 2) {
        let branch = matches[1]

        debug(`${'Successfully'.green} extracted branch name ${branch.cyan}`)

        return {
          commit: pushPayload.head_commit,
          repository: pushPayload.repository,
          branch: branch
        }
      } else {
        debug(`${'Failed'.red} to get branch name from ${pushPayload.ref.cyan}`)

        return Bacon.never()
      }
    })
}
