import Bacon from 'baconjs'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

export default function takeNewBranchPushes(event) {
  return Bacon.once(event)
    .filter((event) => {
      let keep = !event.payload.deleted

      if (keep) {
        debug(`${'Keep:'.green} git branch ${event.payload.ref.cyan} was created.`)
      } else {
        debug(`${'Skip:'.red} No new git branch was created.`)
      }

      return keep
    })
    .flatMap((event) => {
      const GIT_BRANCH_REGEX = /refs\/heads\/(.+)/

      let matches = event.payload.ref.match(GIT_BRANCH_REGEX)

      if (matches && matches.length === 2) {
        debug(`${'Successfully'.green} extracted branch name ${matches[1].cyan}`)

        return {
          commit: event.payload.head_commit,
          branch: matches[1]
        }
      } else {
        debug(`${'Failed'.red} to get branch name from ${event.payload.ref.cyan}`)

        return Bacon.never()
      }
    })
}
