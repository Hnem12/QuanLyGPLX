const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    username: String,
    password: String,
    role: Number,
    SDT: Number,
    Name: String,
    Address: String,
    Image: String,
    Gender: String
},{
    collection:'account'
});

const AccountModel = mongoose.model('account', AccountSchema)
module.exports= AccountModel
