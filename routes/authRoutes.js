const { Router } = require('express');
const csrf = require('csurf');

const authController = require('../controllers/authController');

const router = Router();
const csrfProtection = csrf();
router.use(csrfProtection);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login',  authController.login_get);
router.post('/login',  authController.login_post);
router.get('/logout',  authController.logout_get);


module.exports = router;