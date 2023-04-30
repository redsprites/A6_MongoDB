const { ObjectId } = require('mongodb');
const url = require('url');
const client = require('../lib/mongo.js');
const database_name = "sponsormatch";
async function GET(req, res, collection) {
   let url_components = url.parse(req.url, true);

  let id = url_components.pathname.split('/')[2];

  if (!id) {
    res.status(400).json({ error: 'Missing path parameter' });
    return;
  }

  // Check if the id is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }

  try {
    const db = client.db(database_name);
    const coll = db.collection(collection);
    const result = await coll.find({ _id: new ObjectId(id) }).toArray();
    if (result.length === 0) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(`Error retrieving data: ${err}`);
    res.status(500).json({ error: 'Error retrieving data' });
    return;
  }
}

module.exports = GET;
