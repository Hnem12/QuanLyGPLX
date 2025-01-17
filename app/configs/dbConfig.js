const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://nampzo29903:CZ7OrsPqGiv3wwXj@hnem.sjpgj.mongodb.net/';
mongoose.Promise = global.Promise;
const dbconnect = () => mongoose.connect(MONGO_URI, {}).catch(err => {
    setTimeout(db_connect, 5000)
});
module.exports = { dbconnect }