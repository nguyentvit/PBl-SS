const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/user');
require('dotenv').config()
const { sendVerificationMail } = require('../utils/sendVerificationMail');


exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {name, email, password}  = req.body;
    const token = jwt.sign(
        { name, email, password}, 
        process.env.SECRET_KEY,
        {expiresIn: '20m'}
    );
    sendVerificationMail(res, email, token, 'users');
}

exports.activateAccout = async (req, res, next) => {
    const token = req.params.token;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    }
    catch(err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    const email = decodedToken.email; 
        const name = decodedToken.name;
        const password = decodedToken.password;
    const user = await User.find({email: email});
    if (user.length > 0) {
        res.status(401).json({
            message: 'User existed'
        });
    }
    else {
        bcrypt
                    .hash(password, 12)
                    .then(hashedPw => {
                        const user = new User({
                            email: email,
                            password: hashedPw,
                            name: name
                        });
                        return user.save();
                    })
                    .then(result => {
                        res.status(201).json({
                            message: 'User created',
                            userId: result._id
                        });
                    })
                    .catch(err => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        next(err);
                    });
    }
} 

exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {email, password} = req.body;
    let loadedUser;
    let loadedToken;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found!');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.statusCode = 402;
                throw error;
            }
            const token = jwt.sign(
            {
                email: loadedUser,
                userId: loadedUser._id.toString()
            },
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
            )
            loadedUser.tokens = loadedUser.tokens.concat({token});
            loadedToken = token;
            return loadedUser.save();
        })
        .then(result => {
            res.status(200).json({
                token: loadedToken,
                userId: loadedUser._id.toString()
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
exports.postReset = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email  = req.body.email;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                const err = new Error('No account with that email found');
                err.statusCode = 404;
                throw err;
            }
            const token = jwt.sign(
                { email }, 
                process.env.SECRET_KEY,
                {expiresIn: '20m'}
            );
            sendVerificationMail(res, email, token, 'users/reset');
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    
}

exports.postNewPassword = (req, res, next) => {
    const token = req.params.token;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'pbl4');
    }
    catch(err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const email = decodedToken.email;
    const newPassword = req.body.password;
    let resetUser;
    User.findOne({email: email})
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;
            return resetUser.save();
        })
        .then(result => {
            res.status(200).json({
                message: "Updated new password",
                userId: resetUser._id.toString()
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}
exports.logout = (req, res, next) => {
    const userId = req.userId.toString();
    User.findById(userId)
        .then(user => {
            user.tokens = user.tokens.filter((token) => {
                return token.token != req.token
            })
            return user.save();
        })
        .then(result => {
            res.status(200).json({
                message: "Log out success",
                userId: userId
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}



    
  