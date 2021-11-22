const mongoose = require('mongoose');

const TestModel = new mongoose.Schema({
    mail:{type: String},
    title:{type: String},
    questions:{type: Array},
    timeLimit:{type: String}
});

module.exports = mongoose.model("Test", TestModel);
