import Bacon from 'baconjs'

export default function takeNewBranchPushes(pushPayload) {
  return Bacon.once(pushPayload)
    .filter((pushPayload) => pushPayload.created)
    .flatMap((pushPayload) => {
      const GIT_BRANCH_REGEX = /refs\/heads\/(.+)/

      let matches = pushPayload.ref.match(GIT_BRANCH_REGEX)

      if (matches && matches.length === 2) {
        let branch = matches[1]

        return {
          commit: pushPayload.head_commit,
          repository: pushPayload.repository,
          branch: branch
        }
      } else {
        return Bacon.never()
      }
    })
}
