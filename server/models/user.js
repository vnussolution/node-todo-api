const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 1, trim: true }
    , email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// limit info sent back to client
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'name', 'email']);

}

UserSchema.methods.generateMyAuthToken = function () {
    var user = this;
    var access = 'authenticate';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123');

    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;// return on the second promise in server.js
    });
}

UserSchema.statics.findByFrankToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // })

        return Promise.reject(`Failed:: ${e}`);
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'authenticate'
    });

}

var User = mongoose.model('users', UserSchema);



module.exports = { User };