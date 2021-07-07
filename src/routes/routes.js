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

// Logout / Disconnect
// /api/logout
router.post('/logout', controllers.logout.disconnect);

// Registration
// /api/registration
router.post('/registration', controllers.auth.signUp);

// Current User
// api/user
router.get('/user/', controllers.usersApi.currentUser);

module.exports = router;
