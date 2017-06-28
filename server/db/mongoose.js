var mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://frank:frank1%40@localhost:27017/admin');

module.exports = { mongoose };