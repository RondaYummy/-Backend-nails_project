const express = require('express');
require('express-async-errors');

let isStarted = false;

/**
 * @param {String} host
 * @param {String|Number}port
 * @returns {Promise}
 */
module.exports = (host, port) => new Promise((res, rej) => {
  const app = express();

  app.disable('x-powered-by');

  app.use('/static', express.static('static', {
    index: false,
    fallthrough: false,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.set('host', host);
  app.set('port', port);

  app.listen(3000, 'localhost', () => {
    console.log(`Listening server on ${host}:${port}`);

    res(app);
  });

  app.on('error', (error) => {
    if (!isStarted) {
      isStarted = true;

      rej(error);

      return;
    }

    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);

        process.exit(1);
        break;
      default:
        throw error;
    }
  });
});
