const client = require('../lib/mongo');

const { ObjectId } = require('mongodb');
const database_name = "sponsormatch";

async function DELETE(req, res, collection) {
  let url_components = url.parse(req.url, true);

  console.log(url_components.pathname.split('/'));
  let id = url_components.pathname.split('/')[2];

  if (!id) {
    res.status(400).json({ error: "Missing 'id' parameter" });
    return;
  }

  try {
    const db = client.db(database_name);
    const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: `Document with id '${id}' not found in collection '${collection}'` });
    } else {
      res.status(200).json({ message: `Document with id '${id}' deleted from collection '${collection}'` });
    }
  } catch (err) {
    console.error(`Error deleting document: ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = DELETE;
