const config = require('config');

const app = require('./src/app');
const { dbConnect } = require('./src/utils');

async function server() {
  const { host, port } = config.get('server');

  await app(host, port);
  await dbConnect(config.get('db.uri'));
}

server();
