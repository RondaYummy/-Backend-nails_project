const express = require('express');
require('express-async-errors');

// const isStarted = false;

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

  app.listen(port, host, (err) => {
    if (err) {
      console.error(`Cannot start due to ${err.message}`);

      return rej(err);
    }

    console.log(`Listening server on ${host}:${port}`);
    return res(app);
  });
});
