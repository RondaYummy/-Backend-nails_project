const {
  Router,
} = require('express');

const router = Router();

const controllers = require('../controllers/index');

router.post('/login', controllers.auth.signIn);
router.post('/registration', controllers.auth.signUp);
