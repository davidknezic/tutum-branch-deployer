import Bacon from 'baconjs'
import { expect } from 'chai'
import { spy } from 'sinon'
import writeGitHubStatus from  '../../lib/deploy-to-tutum/write-github-status'

let repository = {
  owner: {
    name: 'axa-ch'
  },
  name: 'style-guide'
}

let sha = 'cbe7a9df55a6797fa84ef74793ace998b185afb7'

function successfulCreate(msg, callback) {
  callback(null, { id: 2016 })
}

function failedCreate(msg, callback) {
  callback('an api error')
}

describe('deploy to tutum', function () {
  describe('write GitHub status', function () {
    it('should write success status', function (done) {
      let fakeGithub = {
        statuses: {
          create: spy(successfulCreate)
        }
      }

      writeGitHubStatus({ state: 'success' }, repository, sha, fakeGithub)
        .onValue((result) => {
          expect(fakeGithub.statuses.create.calledOnce).to.be.true
          done()
        })
    })

    it('should write failure status', function (done) {
      let fakeGithub = {
        statuses: {
          create: spy(successfulCreate)
        }
      }

      writeGitHubStatus({ state: 'failure' }, repository, sha, fakeGithub)
        .onValue((result) => {
          expect(fakeGithub.statuses.create.calledOnce).to.be.true
          done()
        })
    })

    it('should return error value on API error', function (done) {
      let fakeGithub = {
        statuses: {
          create: spy(failedCreate)
        }
      }

      writeGitHubStatus({ state: 'success' }, repository, sha, fakeGithub)
        .onError((error) => {
          expect(error).to.be.equal('an api error')
          done()
        })
    })

    it('should reject invalid status', function () {
      expect(function () {
        writeGitHubStatus({ state: 'invalid' }, repository, sha, {})
      }).to.throw(/invalid state/)
    })
  })
})
