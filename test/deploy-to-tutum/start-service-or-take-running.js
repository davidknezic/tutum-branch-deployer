import Bacon from 'baconjs'
import { expect } from 'chai'
import { expectation } from 'sinon'
import startServiceOrTakeRunning from  '../../lib/deploy-to-tutum/start-service-or-take-running'

process.env.TUTUM_WAIT_TIME = 1500

describe('deploy to tutum', function () {
  describe('start service or take running', function () {
    it('should start a service that succeeds and has before', function (done) {
      let service = {
        resource_uri: '/api/v1/service/74352707-0c01-4b3a-8024-ed2334ad81f2/',
        state: 'Running'
      }

      let fakeTutum = {}
      fakeTutum.startService = expectation.create('startService')
        .once()
        .returns(Promise.resolve({
          resource_uri: service.resource_uri,
          state: 'Starting'
        }))

      let fakeTutumStream = Bacon.once({
        resource_uri: service.resource_uri,
        state: 'Running'
      })

      startServiceOrTakeRunning(service, fakeTutum, fakeTutumStream)
        .onValue(() => {
          fakeTutum.startService.verify()
          done()
        })
    })

    it('should take a running service start that succeeds', function (done) {
      let service = {
        resource_uri: '/api/v1/service/74352707-0c01-4b3a-8024-ed2334ad81f2/',
        state: 'Starting'
      }

      let fakeTutum = {}
      fakeTutum.startService = expectation.create('startService').never()

      let fakeTutumStream = Bacon.once({
        resource_uri: service.resource_uri,
        state: 'Running'
      })

      startServiceOrTakeRunning(service, fakeTutum, fakeTutumStream)
        .onValue(() => {
          fakeTutum.startService.verify()
          done()
        })
    })

    it('should start a service that fails and has before', function (done) {
      let service = {
        resource_uri: '/api/v1/service/74352707-0c01-4b3a-8024-ed2334ad81f2/',
        state: 'Stopped'
      }

      let fakeTutum = {}
      fakeTutum.startService = expectation.create('startService')
        .once()
        .returns(Promise.resolve({
          resource_uri: service.resource_uri,
          state: 'Starting'
        }))

      let fakeTutumStream = Bacon.once({
        resource_uri: service.resource_uri,
        state: 'Stopped'
      })

      startServiceOrTakeRunning(service, fakeTutum, fakeTutumStream)
        .onError(() => {
          fakeTutum.startService.verify()
          done()
        })
    })

    it('should take a running service start that fails after 6s long false positive', function (done) {
      let service = {
        resource_uri: '/api/v1/service/74352707-0c01-4b3a-8024-ed2334ad81f2/',
        state: 'Starting'
      }

      let fakeTutum = {}
      fakeTutum.startService = expectation.create('startService').never()

      let fakeTutumStream = Bacon.once({
          resource_uri: service.resource_uri,
          state: 'Running'
        })
        .merge(Bacon.later(1000, {
          resource_uri: service.resource_uri,
          state: 'Stopped'
        }))

      startServiceOrTakeRunning(service, fakeTutum, fakeTutumStream)
        .onError(() => {
          fakeTutum.startService.verify()
          done()
        })
    })
  })
})
