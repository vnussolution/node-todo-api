const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{ _id: new ObjectID(), text: 'first test todo' },
{ _id: new ObjectID(), text: 'second test todo', completed: true, completedAt: 123 }];


beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var newText = 'new text123123123';
        request(app)
            .patch(`/todos/${id}`)
            .send({ text: newText, completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number')
            })
            .end((err, res) => {
                if (err) return done(err);

                Todo.find({ _id: id }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(newText);
                    done();
                }).catch((e) => done(e));
            });

    });

    it('should clear completeAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var newText = 'new text123234';
        request(app)
            .patch(`/todos/${id}`)
            .send({ text: newText, completed: false })
            .expect(200)
            .expect((res) => {

                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();

            })
            .end((err, res) => {
                if (err) return done(err);

                Todo.find({ _id: id }).then((todo) => {
                    console.log('===<>===', todo);
                    expect(todo[0].text).toBe(newText);
                    expect(todo[0].completed).toNotExist();
                    done();
                }).catch(e => done(e));
            });


    });

});

describe('DELETE /todos/:id', () => {


    it('should return todo doc', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                console.log('+++++++++++', res.body);
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) return done(err);

                Todo.findById(`${res.body.todo._id}`).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 no-object found', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    });

});

describe('======GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 object id is invalid', (done) => {
        request(app)
            .get(`/todos/1234`)
            .expect(404)
            .end(done);
    });

});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) return done(err);

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});