const env = process.env.FOR || process.env.NODE_ENV || 'development';
const _ = require('lodash');

const envConfig = {
  amqpURL: process.env.AMQP_URL || undefined,
  gitlabPrivateAccessToken: process.env.GITLAB_PRIVATE_ACCESS_TOKEN || undefined,
  hobbesUrl: process.env.HOBBES_URL || undefined,
  dpUrl: process.env.DP_URL || undefined,
  gitlabUrl: process.env.GITLAB_URL || undefined,
  sonarQubeServerUrl: process.env.SONAR_QUBE_SERVER_URL || undefined,
  redisHost: process.env.REDIS_HOST || undefined,
  redisPort: process.env.REDIS_PORT || undefined,
  gitlabAssignmentsUrl: process.env.GITLAB_ASSIGNMENTS_URL || undefined,
  gitlabAssignmentsPrivateAccessToken: process.env.GITLAB_ASSIGNMENTS_PRIVATE_ACCESS_TOKEN || undefined
};

const defaultConfig = {
  amqpURL: 'amqp://localhost',
  gitlabPrivateAccessToken: 'zU6-SnYK1yHygLGFyysc',
  hobbesUrl: 'http://hobbes.training.com',
  dpUrl: 'http://35.154.46.4',
  gitlabUrl: 'https://gitlab.training.com',
  sonarQubeServerUrl: 'http://server0.lab.stackroute.in:9000',
  redisHost: 'localhost',
  redisPort: 6379,
  gitlabAssignmentsUrl: 'https://assignments-repo.stackroute.in',
  gitlabAssignmentsPrivateAccessToken: 'saMMUHGwR3jeR-7oyU_f'
};

module.exports = _.defaults(envConfig, require(`./env/${env}`), defaultConfig);
