const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
    if (!email) {
        return false;
    } else if (email.length < 5 || email.length > 35) {
        return false;
    } else {
        return true;
    }
};

let validEmailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};

const emailValidators = [
    {
        validator: emailLengthChecker,
        message: 'Email must be atleast 5 but no more than 35 characters'
    },
    {
        validator: validEmailChecker,
        message: 'Email must be valid!'
    }
];

let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else if (username.length < 3 || username.length > 15) {
        return false;
    } else {
        return true;
    }
};

let validUsernameChecker = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

const usernameValidators = [
    {
        validator: usernameLengthChecker,
        message: 'Username must be atleast 3 but no more than 15 characters'
    },
    {
        validator: validUsernameChecker,
        message: 'Username must not have special characters or space!'
    }
];

let passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    } else if (password.length < 8 || password.length > 20) {
        return false;
    } else {
        return true;
    }
};

let validPasswordChecker = (password) => {
    if (!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
};

const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Password must be atleast 8 but no more than 120 characters'
    },
    {
        validator: validPasswordChecker,
        message: 'Password must have one special, one lowercase, one uppercase letter and a number'
    }
];

const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators }
});

userSchema.pre('save', function(next) {
    if(!this.isModified('passwor')) return next();

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

module.exports = mongoose.model('User', userSchema);