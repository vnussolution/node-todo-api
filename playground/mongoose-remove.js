const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

var id = '595433074e69a9350ce52c34';

if (!ObjectID.isValid(id)) {
    console.log('ID is not valid');
}

Todo.findOneAndRemove({ _id: id }).then((todo) => {
    console.log('==> ', todo);
});

Todo.findByIdAndRemove('595433074e69a9350ce52c35').then((todo) => {
    console.log('>>>>', todo);
});

Todo.remove({}).then((result) => {
    console.log('----', result);
});