const mongoose = require('mongoose');

const TestModel = new mongoose.Schema({
    mail:{type: String},
    title:{type: String},
    questions:{type: Array}
});

module.exports = mongoose.model("Test", TestModel);
