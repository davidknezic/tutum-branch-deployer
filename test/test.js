import request from 'supertest'
import app from '../lib'
import pingPayload from './payloads/ping'

describe('tutum-tagger', function () {

  describe('ping', function () {

    it('should respond successfully', function (done) {
      process.env.EVENT_SECRET = 'rpe-7Ss-tUQ-fMg'

      request(app)
        .post('/postreceive')
        .set('X-GitHub-Delivery', '6827af00-9f1c-11e5-8a41-7e2f1d23045e')
        .set('X-GitHub-Event', 'ping')
        .set('X-Hub-Signature', 'sha1=f374639f5d7c9040043e3f48113c1ae46d75fc70')
        .send(pingPayload)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          done(err)
        })
    })
  })
})
