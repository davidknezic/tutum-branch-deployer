import slug from 'slug'

export default function createService(push, image, buildSetting, done) {

  // hey you! customize your service here.

  let service = {
    image: `${image.name}:${buildSetting.tag}`,
    name: slug(buildSetting.branch),
    container_ports: [{
      protocol: 'tcp',
      inner_port: 3000,
      published: true
    }],
    container_envvars: [{
      key: 'VIRTUAL_PATH',
      value: 'buildSetting.branch'
    }],
    tags: [
      'style-guide'
    ]

    // target_num_containers: 1,
    // run_command: null,
    // entrypoint: null,
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
    // autoredeploy: false,
    // net: 'bridge',
    // pid: 'none',
    // working_dir: '/',
    // nickname: null
  }

  done(null, service)
}
