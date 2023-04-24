const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://test:test@cluster0.ef4gjym.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client;
