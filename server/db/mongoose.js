var mongoose = require('mongoose');


mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

// mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true })
//     .then(({ db: { databaseName } }) => console.log(` connected to ${databaseName}`))
//     .catch(err => console.log(err));

module.exports = { mongoose };