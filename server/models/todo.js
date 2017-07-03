const mongoose = require('mongoose');

var Todo = mongoose.model('MyTodos', {
    text: { type: String, required: true, minlength: 11, trim: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Number, default: false },
    _creator: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = { Todo };