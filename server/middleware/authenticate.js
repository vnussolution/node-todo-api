var { User } = require('./../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-authFrank');

    User.findByFrankToken(token).then((user) => {
        if (!user) return Promise.reject();
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send(e); // 401 authenication required
    });
};

module.exports = { authenticate };