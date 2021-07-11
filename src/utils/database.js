require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// connects to database, initiliazes _db and calls callback
function connect(callback) {
    console.log('Connecting to database...');
    client.connect((err) => {
        if (err) {
            throw err;
        }
        console.log("Connected!");
        _db = client.db();
        callback();
    })
}

// gets database
function getdb() {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
}

module.exports = {
    connect: connect,
    getdb: getdb
};