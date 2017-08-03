require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var { mongoose } = require('./db/mongoose');
var Todo = require('./models/todo').Todo;
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();
var PORT = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('yessss');
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id })
        .then((todos) => {
            res.send({ todos });
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send('Id is not valid');
    }

    Todo.findOne({ _id: id, _creator: req.user.id }).then((todo) => {
        if (!todo) return res.status(404).send('Id not found');

        res.send({ todo });

    }).catch((e) => res.status(400).send(e));

});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.post('/todos', authenticate, (req, res) => {
    var newTodo = new Todo({ text: req.body.text, _creator: req.user._id });

    newTodo.save().then((doc) => {
        //console.log('saved todo', doc);
        //doc['text'] = 'test123';
        res.status(200).send(doc);

    }, (e) => {
        //console.log('unable to save todo', e);
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

// POST /users/login{email,password}
app.post('/users/login', async (req, res) => {

    // var body = _.pick(req.body, ['email', 'password']);
    // User.findByCredentials(body).then((user) => {
    //     if (!user) return res.send('user does not exist');
    //     user.generateMyAuthToken().then((token) => {
    //         res.header('x-authFrank', token).send(user);
    //     })
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });

    //async -await
    try {
        var body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body);
        if (!user) return res.send('user does not exist');

        const token = await user.generateMyAuthToken();
        res.header('x-authFrank', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }


});

app.delete('/users/me/token', authenticate, async (req, res) => {
    // req.user.removeToken(req.token).then(() => {
    //     res.status(200).send('logged out');
    // }, () => res.status(400).send('failed to delete')).catch((e) => console.log(' catch::', e));

    // async -await

    try {
        await req.user.removeToken(req.token);
        res.status(200).send('logged out');
    } catch (e) {
        res.status(400).send('failed to delete');
    }


})

app.post('/users', async (req, res) => {
    var body = _.pick(req.body, ['name', 'email', 'password']);
    var newUser = new User(body);

    // newUser.save().then(() => {
    //     return newUser.generateMyAuthToken();
    // })

    // newUser.generateMyAuthToken().then((token) => {
    //     res.header('x-authFrank', token).send(newUser);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });

    //async -await

    try {
        var token = await newUser.generateMyAuthToken();
        res.header('x-authFrank', token).send(newUser);
    } catch (e) {
        res.status(400).send(e);
    }


});

app.delete('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) return res.status(404).send('id is not valid');

    // Todo.findOneAndRemove({ _id: id, _creator: req.user._id }).then((todo) => {
    //     if (!todo) {
    //         return res.status(404).send('no todo found');
    //     }

    //     res.send({ todo });
    // }).catch((e) => {
    //     res.status(400).send('error ', e);
    // });


    //async -await
    try {
        var todo = await Todo.findOneAndRemove({ _id: id, _creator: req.user._id });
        if (!todo) {
            return res.status(404).send('no todo found');
        }
        res.send({ todo });
    } catch (e) {
        res.status(400).send('error ', e);
    }
});

app.patch(`/todos/:id`, authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) return res.status(404).send('id is invalid');

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) return res.status(404).send('no todo found');

        res.send({ todo });
    }).catch((e) => res.status(400).send(e));

    // Another way to update
    // Todo.findOne({ _id: id, _creator: req.user._id }, (err, todo) => {
    //     if (err) return res.status(400).send(e);

    //     if (!todo) return res.status(404).send('no todo found');

    //     todo.text = body.text;
    //     todo.completedAt = body.completedAt;
    //     todo.completed = body.completed;
    //     todo.save((error, result) => {
    //         if (error) console.log('eee', error);
    //         res.send({ todo });

    //     });
    // }).catch((e) => console.log('patch::', e));


});



app.listen(PORT, () => {
    console.log(`started on port ${PORT}`);
});


module.exports = { app };