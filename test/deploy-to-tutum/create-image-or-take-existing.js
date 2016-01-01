import Bacon from 'baconjs'
import { expect } from 'chai'
import { stub } from 'sinon'
import createImageOrTakeExisting from  '../../lib/deploy-to-tutum/create-image-or-take-existing'

describe('deploy to tutum', function () {
  let fakeTutum = {}
  fakeTutum.getImage = stub()
  fakeTutum.getImage
    .withArgs('tutum.co/axach/style-guide')
    .returns(Promise.resolve({
      resource_uri: '/api/v1/image/tutum.co/axach/style-guide/',
      build_source: {
        owner: 'axa-ch',
        repository: 'style-guide'
      }
    }))
  fakeTutum.getImage
    .withArgs('tutum.co/axach/style-guide-new')
    .returns(Promise.reject('not found'))

  fakeTutum.createImage = stub()
    .returns(Promise.resolve({
      resource_uri: '/api/v1/image/tutum.co/axach/style-guide-new/',
      build_source: {
        owner: 'axa-ch',
        repository: 'style-guide'
      }
    }))

  describe('create image or take existing', function () {
    let repository = {
      name: 'style-guide',
      owner: {
        name: 'axa-ch'
      }
    }

    it('should take an existing image', function (done) {
      let name = 'tutum.co/axach/style-guide'

      createImageOrTakeExisting(name, repository, fakeTutum)
        .onValue((image) => {
          expect(image).to.have.property('resource_uri').and.contain(name)
          expect(image).to.have.deep.property('build_source.owner', 'axa-ch')
          expect(image).to.have.deep.property('build_source.repository', 'style-guide')

          done()
        })
    })

    it('should create a new image', function (done) {
      let name = 'tutum.co/axach/style-guide-new'

      createImageOrTakeExisting(name, repository, fakeTutum)
        .onValue((image) => {
          expect(image).to.have.property('resource_uri').and.contain(name)
          expect(image).to.have.deep.property('build_source.owner', 'axa-ch')
          expect(image).to.have.deep.property('build_source.repository', 'style-guide')

          done()
        })
    })
  })
})
