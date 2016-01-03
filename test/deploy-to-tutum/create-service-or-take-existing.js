import Bacon from 'baconjs'
import { expect } from 'chai'
import { stub } from 'sinon'
import createServiceOrTakeExisting from  '../../lib/deploy-to-tutum/create-service-or-take-existing'

const service = {
  name: 'style-guide',
  image_name: 'tutum.co/axach/style-guide:latest'
}

let fakeTutum = {}
fakeTutum.getService = stub()
fakeTutum.getService
  .onFirstCall()
  .returns(Promise.resolve(service))
fakeTutum.getService
  .onSecondCall()
  .returns(Promise.reject('not found'))
fakeTutum.createService = stub()
fakeTutum.createService
  .returns(Promise.resolve(service))

describe('deploy to tutum', function () {

  describe('create service or take existing', function () {
    let push = {
    }

    let image = {
      name: 'tutum.co/axach/style-guide'
    }

    let buildSetting = {
      tag: 'latest',
      branch: 'develop'
    }

    it('should take an existing service', function (done) {
      function createServiceHook(push, image, buildSetting, done) {
        done(null, { name: 'style-guide' })
      }

      createServiceOrTakeExisting(push, image, buildSetting, fakeTutum, createServiceHook)
        .onValue((service) => {
          expect(service).to.have.property('image_name', 'tutum.co/axach/style-guide:latest')
          done()
        })
    })

    it('should create a new service', function (done) {
      function createServiceHook(push, image, buildSetting, done) {
        done(null, {
          name: 'style-guide',
          image: 'tutum.co/axach/style-guide:latest'
        })
      }

      createServiceOrTakeExisting(push, image, buildSetting, fakeTutum, createServiceHook)
        .onValue((service) => {
          expect(fakeTutum.createService.calledOnce).to.be.true
          expect(fakeTutum.createService.calledWithMatch({
            name: 'style-guide',
            image: 'tutum.co/axach/style-guide:latest'
          })).to.be.true
          expect(service).to.have.property('image_name', 'tutum.co/axach/style-guide:latest')
          done()
        })
    })
  })
})
