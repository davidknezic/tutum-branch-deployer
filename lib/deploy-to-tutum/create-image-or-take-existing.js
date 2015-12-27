import Bacon from 'baconjs'

export default function createImageOrTakeExisting(name, repository, tutum) {
  return getImage(name, tutum)
    .flatMapError((error) => {
      return createImage(name, repository, tutum)
    })
}

function getImage(name, tutum) {
  return Bacon.fromPromise(tutum.getImage(name))
}

function createImage(name, repository, tutum) {
  let image = {
    name: name,
    description: repository.description,
    build_source: {
      type: 'GITHUB',
      repository: repository.name,
      owner: repository.owner.name,
      autotests: 'OFF',
      build_settings: [],
      envvars: []
    }
  }

  return Bacon.fromPromise(tutum.createImage(image))
}
