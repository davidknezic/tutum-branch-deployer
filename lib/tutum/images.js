import superagent from 'superagent'
import superagentPromise from 'superagent-promise'

let request = superagentPromise(superagent, Promise)

export function list() {
}

export function create() {
}

export function get() {
  return request
    .get(`https://dashboard.tutum.co/api/v1/image/${process.env.TUTUM_IMAGE}/`)
    .auth(`ApiKey ${process.env.TUTUM_USERNAME}:${process.env.TUTUM_APIKEY}`)
    .set('Accept', 'application/json')
}

export function update() {
}

export function delete() {
}
