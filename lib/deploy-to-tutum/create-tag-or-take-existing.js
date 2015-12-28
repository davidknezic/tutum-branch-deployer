import Bacon from 'baconjs'
import R from 'ramda'
import clone from 'clone'
import slug from 'slug'

export default function createTagOrTakeExisting(image, branch, tutum) {
  return getAllBuildSettings(image.build_source.build_settings, tutum)
    .flatMap((buildSettings) => {
      let findBuildSetting = R.find(R.propEq('branch', branch))
      let buildSetting = findBuildSetting(buildSettings)

      if (buildSetting) {
        return buildSetting
      }

      let tag = slug(branch)
      let updatedBuildSettings = clone(buildSettings)

      updatedBuildSettings.push({
        tag: tag,
        branch: branch,
        dockerfile: '/',
        autobuild: true
      })

      return setBuildSettingsForImage(image, updatedBuildSettings, tutum)
        .flatMap(() => getBuildSetting(image, tag, tutum))
    })
}

function getAllBuildSettings(uris, tutum) {
  let promises = uris.map((uri) => tutum.getBuildSetting({ uri }))

  return Bacon.fromPromise(Promise.all(promises))
}

function setBuildSettingsForImage(image, buildSettings, tutum) {
  let payload = {
    build_source: {
      repository: image.build_source.repository,
      build_settings: buildSettings
    }
  }

  return Bacon.fromPromise(tutum.updateImage({ uri: image.resource_uri }, payload))
}

function getBuildSetting(image, tag, tutum) {
  return Bacon.fromPromise(tutum.getBuildSetting({
    name: image.name,
    tag: tag
  }))
}
