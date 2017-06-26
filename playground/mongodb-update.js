
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://frank:frank1%40@localhost:27017/admin', (err, db) => {
    if (err) return console.log('unable to connect do mongo server');

    console.log('connected to mongo server');


    // db.collection('Todos')
    //     .findOneAndUpdate({ _id: new ObjectID('595170fd9490517237a1ac16') }
    //     , { $set: { completed: true, text: 'buy milk12355666777' } }
    //     , { returnOriginal: false })
    //     .then((result) => {
    //         console.log(result);

    //     });

    db.collection('Users')
        .findOneAndUpdate({ name: 'khoi' }
        , { $set: { location: 'fountainvalley' }, $inc: { age: 10 } }
        , { returnOriginal: false })
        .then((result) => {
            console.log(result);

        });

});