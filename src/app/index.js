const express = require('express');
require('express-async-errors');
const expressJWT = require('express-jwt');
const config = require('../../config/development.json');
const routes = require('../routes/routes');

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
  app.use('/api', routes);

  app.use(express.json());
  app.use(express.urlencoded({
    extended: true,
  }));

  app.listen(port, host, (err) => {
    if (err) {
      console.error(`Cannot start due to ${err.message}`);

      return rej(err);
    }

    console.log(`Listening server on ${host}:${port}`);
    return res(app);
  });

  app.use(expressJWT({
    secret: config.jwt.secret,
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      }
      if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    },
  }));
});
