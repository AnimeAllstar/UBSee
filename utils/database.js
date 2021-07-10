require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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