import template from 'url-template'
import superagent from 'superagent'
import superagentPromise from 'superagent-promise'
import colors from 'colors'

let debug = require('debug')('tutum-tagger')

let request = superagentPromise(superagent, Promise)

const API_HOST = 'https://dashboard.tutum.co'
const API_BASE = 'https://dashboard.tutum.co/api/v1'

export default class TutumApi {

  constructor(options) {
    this.headers = options.headers || {}
    this.auth = null
  }

  authenticate(options) {
    this.auth = {
      username: options.username,
      apikey: options.apikey
    }
  }

  getImage(name) {
    let url = this._expand(`/image/{name}/`, { name })

    return request
      .get(url)
      .auth(this.auth.username, this.auth.apikey)
      .accept('json')
      .set(this.headers)
      .then((res) => this._errorHandler(res))
  }

  listImages() {
    return request
      .get(this._expand('/image/'))
      .auth(this.auth.username, this.auth.apikey)
      .accept('json')
      .set(this.headers)
      .then((res) => this._errorHandler(res))
  }

  createImage(image) {
    return request
      .post(this._expand('/image/'))
      .send(image)
      .auth(this.auth.username, this.auth.apikey)
      .accept('json')
      .set(this.headers)
      .then((res) => this._errorHandler(res))
  }

  allBuildSettings(name) {
    return this.getImage(name)
      .then((image) => {
        return Promise.all(image.build_source.build_settings.map((uri) => {
          return this.getBuildSetting({ uri })
        }))
      })
  }

  getBuildSetting(options) {
    let url

    if (options.uri) {
      url = API_HOST + options.uri
    } else if (options.name && options.tag) {
      url = this._expand('/image/{name}/buildsetting/{tag}/', {
        name: options.name,
        tag: options.tag
      })
    } else {
      throw new Error(`Either 'uri' option or 'name', 'tag' combination missing`)
    }

    return request
      .get(url)
      .auth(this.auth.username, this.auth.apikey)
      .accept('json')
      .set(this.headers)
      .then((res) => this._errorHandler(res))
  }

  buildTag(options) {
    let url

    if (options.uri) {
      url = `${API_HOST}${options.uri}build/`
    } else if (options.name && options.tag) {
      url = this._expand('/image/{name}/buildsetting/{tag}/build/', {
        name: options.name,
        tag: options.tag
      })
    } else {
      throw new Error(`Either 'uri' option or 'name', 'tag' combination missing`)
    }

    return request
      .post(url)
      .auth(this.auth.username, this.auth.apikey)
      .accept('json')
      .set(this.headers)
      .then((res) => this._errorHandler(res))
  }

  updateImage(options, details) {
    let url

    if (options.uri) {
      url = API_HOST + options.uri
    } else if (options.name) {
      url = this._expand('/image/{name}/', { name: options.name })
    } else {
      throw new Error(`Either 'uri' option or 'name' missing`)
    }

    return request
      .patch(url)
      .send(details)
      .auth(this.auth.username, this.auth.apikey)
      .accept('json')
      .type('json')
      .set(this.headers)
      .then((res) => this._errorHandler(res))
  }

  createService(service) {
    return request
      .post(this._expand('/service/'))
      .send(service)
      .auth(this.auth.username, this.auth.apikey)
      .accept('json')
      .set(this.headers)
      .then((res) => this._errorHandler(res))
  }

  startService(options) {
    let url

    if (options.uri) {
      url = `${API_HOST}${options.uri}start/`
    } else if (options.uuid) {
      url = this._expand('/service/{uuid}/start/', { uuid: options.uuid })
    } else {
      throw new Error(`Either 'uri' option or 'uuid' missing`)
    }

    return request
      .post(url)
      .auth(this.auth.username, this.auth.apikey)
      .accept('json')
      .set(this.headers)
      .then((res) => this._errorHandler(res))
  }

  terminateService(options) {
    let url

    if (options.uri) {
      url = API_HOST + options.uri
    } else if (options.uuid) {
      url = this._expand('/service/{uuid}/', { uuid: options.uuid })
    } else {
      throw new Error(`Either 'uri' option or 'uuid' missing`)
    }

    return request
      .delete(url)
      .auth(this.auth.username, this.auth.apikey)
      .accept('json')
      .set(this.headers)
      .then((res) => this._errorHandler(res))
  }

  listServices() {
    return request
      .get(this._expand('/service/'))
      .auth(this.auth.username, this.auth.apikey)
      .accept('json')
      .set(this.headers)
      .then((res) => this._errorHandler(res))
  }

  _errorHandler(res) {
    return new Promise(function (resolve, reject) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        return resolve(res.body)
      } else {
        debug(`${'Errored'.red} with status code ${res.statusCode}: ${res.body.error}!`)
        return reject(res.body.error)
      }
    })
  }

  _expand(path, params) {
    var url = template.parse(`${API_BASE}${path}`);
    return url.expand(params)
  }
}
