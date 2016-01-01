import Bacon from 'baconjs'
import { expect } from 'chai'
import { stub } from 'sinon'
import createTagOrTakeExisting from  '../../lib/deploy-to-tutum/create-tag-or-take-existing'

const buildSettings = {
  'one-branch': {
    branch: 'one-branch',
    resource_uri: '/api/v1/image/tutum.co/axach/style-guide/buildsetting/one-branch/',
    tag: 'one-branch'
  },
  'another-branch': {
    branch: 'another-branch',
    resource_uri: '/api/v1/image/tutum.co/axach/style-guide/buildsetting/another-branch/',
    tag: 'another-branch'
  }
}

describe('deploy to tutum', function () {
  let fakeTutum = {}
  fakeTutum.getBuildSetting = stub()
  fakeTutum.getBuildSetting
    .withArgs({ uri: '/api/v1/image/tutum.co/axach/style-guide/buildsetting/one-branch/' })
    .returns(Promise.resolve(buildSettings['one-branch']))
  fakeTutum.getBuildSetting
    .withArgs({ name: 'tutum.co/axach/style-guide', tag: 'one-branch' })
    .returns(Promise.resolve(buildSettings['one-branch']))
  fakeTutum.getBuildSetting
    .withArgs({ uri: '/api/v1/image/tutum.co/axach/style-guide/buildsetting/another-branch/' })
    .returns(Promise.resolve(buildSettings['another-branch']))
  fakeTutum.getBuildSetting
    .withArgs({ name: 'tutum.co/axach/style-guide', tag: 'another-branch' })
    .returns(Promise.resolve(buildSettings['another-branch']))

  fakeTutum.updateImage = stub()
    .returns(Promise.resolve({}))

  describe('create tag or take existing', function () {
    let image = {
      name: 'tutum.co/axach/style-guide',
      build_source: {
        build_settings: [
          '/api/v1/image/tutum.co/axach/style-guide/buildsetting/one-branch/'
        ]
      }
    }

    it('should take an existing tag', function (done) {
      let branch = 'one-branch'

      createTagOrTakeExisting(image, branch, fakeTutum)
        .onValue((tag) => {
          expect(tag).to.have.property('resource_uri', '/api/v1/image/tutum.co/axach/style-guide/buildsetting/one-branch/')
          expect(tag).to.have.property('branch', 'one-branch')
          expect(tag).to.have.property('tag', 'one-branch')

          done()
        })
    })

    it('should create a new tag', function (done) {
      let branch = 'another-branch'

      createTagOrTakeExisting(image, branch, fakeTutum)
        .onValue((tag) => {
          expect(tag).to.have.property('resource_uri', '/api/v1/image/tutum.co/axach/style-guide/buildsetting/another-branch/')
          expect(tag).to.have.property('branch', 'another-branch')
          expect(tag).to.have.property('tag', 'another-branch')

          done()
        })
    })
  })
})
