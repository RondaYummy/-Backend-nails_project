const {
  Router,
} = require('express');

const router = Router();

const controllers = require('../controllers/index');

// Auth
// /api/signin
// /api/refresh-tokens
router.post('/signin', controllers.auth.signIn);
router.post('/refresh-tokens', controllers.auth.refreshTokens);

// Registration
// /api/registration
router.post('/registration', controllers.auth.signUp);

module.exports = router;
