//const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require('mongodb'); // new ES6 syntax: object desctructuring 

var user = { name: 'test', age: '22', location: 'cali' };
var { name, age } = user;// new ES6 syntax: object desctructuring 
console.log(name, age);



MongoClient.connect('mongodb://frank:frank1%40@localhost:27017/admin', (err, db) => {
    if (err) return console.log(`unable to connect to server: ${err}`);

    console.log(`Connected to mongodb server`);

    db.collection('Todos').find().count().then((count) => {
        console.log(`todos count: ${count}`);
    }, (err) => {
        console.log(`unable to fetch todos ${err}`);
    })

    db.collection('Todos').find({
        _id: new ObjectID('595029992063ab0a0450a101')
    }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('unable to fetch todos',
            err);
    });

    db.collection('Users').find({ name: 'Frank' }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('unable to fetch users');
    });


    // db.close();
});





