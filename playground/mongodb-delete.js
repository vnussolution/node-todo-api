
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://frank:frank1%40@localhost:27017/admin', (err, db) => {
    if (err) return console.log('unable to connect do mongo server');

    console.log('connected to mongo server');

    //deleteMany
    // db.collection('Todos').deleteMany({ text: 'lunch' }).then((result) => {
    //     console.log(result);
    // });

    //deleteOne
    // db.collection('Todos').deleteOne({ text: 'lunch' }).then((result) => {
    //     console.log(result);
    // });

    // //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({ completed: true }).then((result) => {
    //     console.log(result);
    // });


    //db.collection('Users').findOneAndDelete({ _id: new ObjectID('595042cac95e9c7007c23ea0') });

    db.collection('Users').deleteMany({ name: 'Tester' }).then((result) => {
        console.log('deleted the user', result);
    });

});