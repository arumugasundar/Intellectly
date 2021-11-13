const mongoose = require('mongoose');

const UserModel = new mongoose.Schema({
    mail:{type: String},
    password:{type: String}
});

module.exports = mongoose.model("User", UserModel);
