const express = require('express');
const { body } = require('express-validator');
const User = require('../Model/user');
const authController = require('../Controller/auth');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.post('/', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({email: value})
                        .then(userDoc => {
                            if (userDoc) {
                                return Promise.reject('E-mail address already exists!');
                            }
                        })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 6}),
    body('name')
        .trim()
        .not()
        .isEmpty()
], authController.signup)
  

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 5}) 
] , authController.login)



router.post('/reset', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail()
], authController.postReset)

router.post('/reset/:token', authController.postNewPassword);

router.post('/me/logout', isAuth, authController.logout);

router.post('/:token', authController.activateAccout);

module.exports = router;
