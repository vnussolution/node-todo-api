
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');


const user1Id = new ObjectID();
const user2Id = new ObjectID();

const users = [{
    _id: user1Id,
    name: 'user1',
    email: 'user1@frank.com',
    password: 'frank1@',
    tokens: [{
        access: 'authFrank',
        token: jwt.sign({ _id: user1Id, access: 'authFrank' }, process.env.JWT_SECRET).toString()
    }]
},
{
    _id: user2Id,
    name: 'user2',
    email: 'user2@frank.com',
    password: 'frank1@',
    tokens: [{
        access: 'authFrank',
        token: jwt.sign({ _id: user2Id, access: 'authFrank' }, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [
    {
        _id: new ObjectID(),
        text: 'first test todo',
        _creator: user1Id
    },
    {
        _id: new ObjectID(),
        text: 'second test todo',
        completed: true,
        completedAt: 123,
        _creator: user2Id
    }
];


const populateTodos = (done) => {
    //console.log('populateTodos');
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();

        return Promise.all([user1, user2])

    }).then((values) => {
        done();
    });
};

module.exports = { todos, populateTodos, users, populateUsers };