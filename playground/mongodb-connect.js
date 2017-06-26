//const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb'); // new ES6 syntax: object desctructuring 

var user = { name: 'test', age: '22', location: 'cali' };
var { name, age } = user;// new ES6 syntax: object desctructuring 
console.log(name, age);



MongoClient.connect('mongodb://frank:frank1%40@localhost:27017/admin', (err, db) => {
    if (err) return console.log(`unable to connect to server: ${err}`);

    console.log(`Connected to mongodb server`);

    db.collection('Users').insertOne({
        name: 'Frank',
        age: 23,
        location: 'california'
    }, (err, result) => {
        if (err) return console.log(`unable to insert todo`, err);
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();
});





