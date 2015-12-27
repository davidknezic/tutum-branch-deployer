import GitHubApi from 'github'
import TutumApi from './lib/tutum'
import createGithubEvents from './lib/github-events'
import createTutumEvents from './lib/tutum-events'
import colors from 'colors'
import Bacon from 'baconjs'
import deployToTutum from './lib/deploy-to-tutum'
import answerToPing from './lib/answer-to-ping'

let debug = require('debug')('tutum-tagger')

let githubEvents = createGithubEvents({
  host: '0.0.0.0',
  port: 1337,
  secret: process.env.GITHUB_WEBHOOK_SECRET
})

let tutumEvents = createTutumEvents({
  username: process.env.TUTUM_USERNAME,
  apikey: process.env.TUTUM_APIKEY
})

let github = new GitHubApi({
  version: '3.0.0',
  headers: {
    'user-agent': 'Tutum-Tagger'
  }
})

github.authenticate({
  type: 'basic',
  username: process.env.GITHUB_USERNAME,
  password: process.env.GITHUB_APIKEY
})

let tutum = new TutumApi({
  headers: {
    'user-agent': 'Tutum-Tagger'
  }
})

tutum.authenticate({
  username: process.env.TUTUM_USERNAME,
  apikey: process.env.TUTUM_APIKEY
})

github.user.get({}, function (err, user) {
  debug(`Successfully ${'signed in'.bgGreen.black} as ${user.login.cyan}`)
})

Bacon.fromEvent(githubEvents, 'push')
  .flatMap((event) => deployToTutum(event, tutum, tutumEvents, github))

Bacon.fromEvent(githubEvents, 'ping')
  .flatMap((event) => answerToPing(event))
