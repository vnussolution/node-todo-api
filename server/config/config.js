var env = process.env.NODE_ENV || 'development';

console.log('env ===== ', env);

if (env === 'development' || env == 'test') {
    var config = require('./config.json');
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://frank:frank123@ds047571.mlab.com:47571/node-todo-api-prod';

// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://frank:frank12@ds032340.mlab.com:32340/node-todo-api-test'
// }