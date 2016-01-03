import slug from 'slug'

export default function createService(push, image, buildSetting, done) {

  // hey you! customize your service here.

  let service = {
    image: `${image.name}:${buildSetting.tag}`,
    name: slug(buildSetting.branch)

    // target_num_containers: 1,
    // run_command: null,
    // entrypoint: null,
    // container_ports: [{
    //   protocol: 'tcp',
    //   inner_port: 80,
    //   outer_port: 80,
    //   published: false
    // }],
    // container_envvars: [{
    //   key: 'DB_PASSWORD',
    //   value: 'mypass'
    // }],
    // linked_to_service: [{
    //   to_service: '/api/v1/service/80ff1635-2d56-478d-a97f-9b59c720e513/',
    //   name: 'db'
    // }],
    // bindings: [{
    //   host_path: '/etc',
    //   container_path: '/etc',
    //   volumes_from: '/api/v1/service/80ff1635-2d56-478d-a97f-9b59c720e513/',
    //   rewritable: true
    // }],
    // autorestart: 'OFF',
    // autodestroy: 'OFF',
    // sequential_deployment: false,
    // roles: ['global'],
    // privileged: false,
    // deployment_strategy: 'EMPTIEST_NODE',
    // tags: ['mytag'],
    // autoredeploy: false,
    // net: 'bridge',
    // pid: 'none',
    // working_dir: '/',
    // nickname: null
  }

  done(null, service)
}
