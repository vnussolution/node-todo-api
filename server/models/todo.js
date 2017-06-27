const mongoose = require('mongoose');

var Todo = mongoose.model('MyTodo', {
    text: { type: String, required: true, minlength: 11, trim: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Number, default: false }
});

module.exports = { Todo };