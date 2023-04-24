const { ObjectId } = require('mongodb');
const client = require('../lib/mongo.js');
const database_name = "sponsormatch";

async function POST(req, res, collection) {
  const data = req.body;

  // Perform validation on the data
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    res.status(400).json({ error: 'Invalid data format: expected an object' });
    return;
  }

  try {
    const db = client.db(database_name);
    const coll = db.collection(collection);
    const result = await coll.insertOne(data);

    res.status(201).json({ ...data, _id: result.insertedId });
  } catch (err) {
    console.error(`Error inserting document: ${err}`);
    res.status(500).json({ error: 'Error inserting document' });
  }
}

module.exports = POST;
