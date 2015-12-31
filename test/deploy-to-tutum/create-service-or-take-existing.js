import Bacon from 'baconjs'
import { expect } from 'chai'
import { expectation, stub } from 'sinon'
import createServiceOrTakeExisting from  '../../lib/deploy-to-tutum/create-service-or-take-existing'

const services = {
  'style-guide': {
    image_name: 'tutum.co/axach/style-guide:latest'
  },
  'something-else': {
    image_name: 'tutum.co/axach/something:else'
  }
}

let fakeTutum = {}
fakeTutum.listServices = stub()
fakeTutum.listServices
  .onFirstCall()
  .returns(Promise.resolve([services['style-guide'], services['something-else']]))
fakeTutum.listServices
  .onSecondCall()
  .returns(Promise.resolve([services['something-else']]))

describe('deploy to tutum', function () {

  describe('create service or take existing', function () {
    let image = {
      name: 'tutum.co/axach/style-guide'
    }

    let buildSetting = {
      tag: 'latest',
      branch: 'develop'
    }

    it('it should take an existing service', function (done) {
      createServiceOrTakeExisting(image, buildSetting, fakeTutum)
        .onValue((service) => {
          expect(service).to.have.property('image_name', 'tutum.co/axach/style-guide:latest')
          done()
        })
    })

    it('it should create a new service', function (done) {
      fakeTutum.createService = expectation.create('createService')
        .once()
        .returns(Promise.resolve({
          image_name: 'tutum.co/axach/style-guide:latest'
        }))

      createServiceOrTakeExisting(image, buildSetting, fakeTutum)
        .onValue((service) => {
          expect(service).to.have.property('image_name', 'tutum.co/axach/style-guide:latest')
          fakeTutum.createService.verify()
          done()
        })
    })
  })
})
