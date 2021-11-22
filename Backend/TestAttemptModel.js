const mongoose = require('mongoose');

const TestAttemptModel = new mongoose.Schema({
    timestamp:{type:Date,default:Date.now()},
    creatorMail:{type: String},
    writerMail:{type: String},
    title:{type: String},
    answerResponse:{type: Array},
    timeLimit:{type: String},
    timeTaken:{type: String},
    tabSwitch:{type: String},
    marks:{type: String},
    totalMarks:{type:String}
});

module.exports = mongoose.model("TestAttempt", TestAttemptModel);
