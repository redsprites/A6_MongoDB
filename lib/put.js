const { ObjectId } = require('mongodb');
const client = require('../lib/mongo.js');
const database_name = "sponsormatch";

async function PUT(req, res, collection) {
  const pathComponents = req.url.split('/').slice(2);

  if (pathComponents.length === 0) {
    res.status(400).json({ error: 'Missing path parameter' });
    return;
  }

  const id = new ObjectId(pathComponents[0]);
  const coll = client.db(database_name).collection(collection);

  let result = await coll.find({ "_id": id }).toArray();

  if (result.length === 0) {
    res.status(404).json({ error: 'File not found' });
    return;
  }

  const data = req.body;

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    res.status(400).json({ error: 'Invalid data format: expected an object' });
    return;
  }

  try {
    result = await coll.updateOne({ "_id": id}, {$set:{test:data.test, test_1:data.test_1}});

    // If everything succeeds, return a 200 OK response with the updated file path and ID
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify({_id: id}));
  } catch (err) {
    res.status(500).json({ error: 'Error updating document' })
  }
}

module.exports = PUT;