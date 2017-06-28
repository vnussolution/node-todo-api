const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');


var id = '5951a21ee363bd3f300d72c1';
if (!ObjectID.isValid(id)) {
    console.log('ID is not valid');
}

User.find({ _id: id }).then((todos) => {
    console.log('todos', todos);
});

User.findById(id).then((todo) => {
    if (!todo) return console.log('id not found');
    console.log('todo', todo);
}).catch((e) => console.log(e));


// Todo.find({ _id: id }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({ _id: id }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('id not found');
//     }
//     console.log('todo by id ', todo)
// }).catch((e) => { console.log(e) });