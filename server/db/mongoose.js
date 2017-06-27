var mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://frank:frank1%40@localhost:27017/admin');

module.exports = { mongoose };