import Bacon from 'baconjs'
import { expect } from 'chai'
import { expectation } from 'sinon'
import startBuildOrTakeRunning from  '../../lib/deploy-to-tutum/start-build-or-take-running'

describe('deploy to tutum', function () {
  describe('start build or take running', function () {
    it('it should start a fresh new build that succeeds', function (done) {
      let buildSetting = {
        resource_uri: '/api/v1/image/tutum.co/axach/style-guide/buildsetting/latest/',
        state: 'Success'
      }
      let fakeTutum = {}
      fakeTutum.buildTag = expectation.create('buildTag')
        .once()
        .returns(Promise.resolve(buildSetting))
      let fakeTutumStream = Bacon.once({
        resource_uri: buildSetting.resource_uri,
        state: 'Success'
      })

      startBuildOrTakeRunning(buildSetting, fakeTutum, fakeTutumStream)
        .onValue((isSuccessful) => {
          expect(isSuccessful).to.be.true
          fakeTutum.buildTag.verify()
          done()
        })
    })

    it('it should take a running build that succeeds', function (done) {
      let buildSetting = {
        resource_uri: '/api/v1/image/tutum.co/axach/style-guide/buildsetting/latest/',
        state: 'Building'
      }
      let fakeTutum = {}
      fakeTutum.buildTag = expectation.create('buildTag').never()
      let fakeTutumStream = Bacon.once({
        resource_uri: buildSetting.resource_uri,
        state: 'Success'
      })

      startBuildOrTakeRunning(buildSetting, fakeTutum, fakeTutumStream)
        .onValue((isSuccessful) => {
          expect(isSuccessful).to.be.true
          fakeTutum.buildTag.verify()
          done()
        })
    })

    it('it should start a fresh new build that fails', function (done) {
      let buildSetting = {
        resource_uri: '/api/v1/image/tutum.co/axach/style-guide/buildsetting/latest/',
        state: 'Success'
      }
      let fakeTutum = {}
      fakeTutum.buildTag = expectation.create('buildTag')
        .once()
        .returns(Promise.resolve(buildSetting))
      let fakeTutumStream = Bacon.once({
        resource_uri: buildSetting.resource_uri,
        state: 'Failed'
      })

      startBuildOrTakeRunning(buildSetting, fakeTutum, fakeTutumStream)
        .onValue((isSuccessful) => {
          expect(isSuccessful).to.be.false
          fakeTutum.buildTag.verify()
          done()
        })
    })

    it('it should take a running build that fails', function (done) {
      let buildSetting = {
        resource_uri: '/api/v1/image/tutum.co/axach/style-guide/buildsetting/latest/',
        state: 'Building'
      }
      let fakeTutum = {}
      fakeTutum.buildTag = expectation.create('buildTag').never()
      let fakeTutumStream = Bacon.once({
        resource_uri: buildSetting.resource_uri,
        state: 'Failed'
      })

      startBuildOrTakeRunning(buildSetting, fakeTutum, fakeTutumStream)
        .onValue((isSuccessful) => {
          expect(isSuccessful).to.be.false
          fakeTutum.buildTag.verify()
          done()
        })
    })
  })
})
