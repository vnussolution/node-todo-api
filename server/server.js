require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');
const _ = require('lodash');


var { mongoose } = require('./db/mongoose');
var Todo = require('./models/todo').Todo;
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate')

var app = express();
var PORT = process.env.PORT;

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



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
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

app.get('/users', (req, res) => {
    User.find().then(users => {
        res.send({ users });
    }, error => {
        res.send(error);
    });
});

app.post('/users', (req, res) => {


    // var newUser = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    var body = _.pick(req.body, ['name', 'email', 'password']);
    var newUser = new User(body);

    // newUser.save().then(() => {
    //     console.log('server.js - POST/users - save --->', newUser.password);
    //     return newUser.generateMyAuthToken();
    // })

    newUser.generateMyAuthToken().then((token) => {
        res.header('x-authenticate', token).send(newUser);
    })
        .catch((e) => {
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
        todo.completedAt = body.completedAt;
        todo.completed = body.completed;
        todo.save((error, result) => {
            if (error) console.log('eee', error);
            console.log('------>>>', result);
            res.send({ todo });

        });
    })

});



app.listen(PORT, () => {
    console.log(`started on port ${PORT}`);
});


module.exports = { app };