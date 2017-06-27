var express = require('express');
var bodyParser = require('body-parser');


var mongoose = require('./db/mongoose').mongoose;
var Todo = require('./models/todo').Todo;
var { User } = require('./models/user');


var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('yessss');
});

app.post('/todos', (req, res) => {
    var newTodo = new Todo({ text: req.body.text });

    newTodo.save().then((doc) => {
        console.log('saved todo', doc);
        //doc['text'] = 'test123';
        res.status(200).send(doc);

    }, (e) => {
        console.log('unable to save todo', e);
        res.status(400).send(e);

    });
});

app.post('/user', (req, res) => {

    var newUser = new User({ name: req.body.name, email: req.body.email });

    newUser.save().then((doc) => {
        res.status(200).send(doc);
    }, (e) => {
        console.log('failed to save user ', e);
        res.status(400).send(e);

    });
});

app.listen(PORT, () => {
    console.log(`started on port ${PORT}`);
});


module.exports = { app };