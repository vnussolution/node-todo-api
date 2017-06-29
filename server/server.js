var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');
const _ = require('lodash');


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
        console.log('1==>');
        if (!todo) {
            console.log('nothing to delete');
            return res.status(404).send('no todo found');

        }
        console.log('2==>', todo);

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send('error ', e);
    });
});

app.patch(`/todos/:id`, (req, res) => {
    var id = req.params.id;
    console.log(id);
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) return res.status(404).send('id is invalid');

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // Todo.findOneAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
    //     if (!todo) return res.status(404).send('no todo found');

    //     res.send({ todo });
    // }).catch((e) => res.status(400).send(e));

    Todo.findById(id, (err, todo) => {
        if (err) return res.status(400).send(e);

        if (!todo) return res.status(404).send('no todo found');

        todo.text = body.text;
        todo.save((error, result) => {
            if (error) console.log('eee', error);

            res.send({ result });

        });
    })

});



app.listen(PORT, () => {
    console.log(`started on port ${PORT}`);
});


module.exports = { app };