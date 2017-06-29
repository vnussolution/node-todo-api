var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');


var { mongoose } = require('./db/mongoose');
var Todo = require('./models/todo').Todo;
var { User } = require('./models/user');


var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('yessss');
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send('Id is not valid');
    }

    Todo.findById(id).then((todo) => {
        if (!todo) return res.status(404).send('Id not found');

        res.send({ todo });

    }).catch((e) => res.status(400).send(e));

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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) return res.status(404).send('id is not valid');

    Todo.findByIdAndRemove(id).then((todo) => {
        console.log('==>');
        if (!todo) return res.status(404).send('no todo found');
        res.send(`successfully removed ${todo}`);
    }).catch((e) => {
        res.status(400).send('error ', e);
    });
})

app.listen(PORT, () => {
    console.log(`started on port ${PORT}`);
});


module.exports = { app };