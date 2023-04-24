const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const app = express();
app.use(bodyParser.json());

const publicDirectoryPath = path.join(__dirname, './');
app.use(express.static(publicDirectoryPath));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
// POST Api Yoseph
  
app.post('/myapi', async (req, res) => {
  const id = generateUniqueId();
  const filePath = `./data/${id}.json`;

  try {
    await fs.writeJson(filePath, req.body);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ error: 'Error creating the JSON file' });
  }
});
//   GET /api/:id - retrieve a JSON document from a file


//   PUT /api/:id - update the content of a JSON document with new content and store it into the same file  


//   DELETE /api/:id - reset the content of the JSON document