import Bacon from 'baconjs'
import { expect } from 'chai'
import takeNewBranchPushes from  '../../lib/deploy-to-tutum/take-new-branch-pushes'

describe('deploy to tutum', function () {
  describe('take new branch pushes', function () {
    it('it should take push creating new branch', function (done) {
      let payload = {
        ref: 'refs/heads/bugfix/fix-the-main-menu',
        created: true,
        head_commit: {
          id: 'cbe7a9df55a6797fa84ef74793ace998b185afb7'
        },
        repository: {
          name: 'style-guide',
          owner: {
            name: 'axa-ch'
          }
        }
      }

      takeNewBranchPushes(payload)
        .onValue((push) => {
          expect(push.commit).to.have.property('id')
          expect(push.repository).to.have.property('name')
          expect(push.repository).to.have.deep.property('owner.name')
          expect(push.branch).to.be.a('string')

          done()
        })
    })

    it('it should reject push not creating new branch', function (done) {
      let payload = {
        ref: 'refs/heads/bugfix/fix-the-main-menu',
        created: false,
        head_commit: {
          id: 'cbe7a9df55a6797fa84ef74793ace998b185afb7'
        },
        repository: {
          name: 'style-guide',
          owner: {
            name: 'axa-ch'
          }
        }
      }

      takeNewBranchPushes(payload)
        .doAction((push) => {
          throw new Error('no push should be allowed')
        })
        .onEnd(done)
    })
  })
})
