const express = require('express');
const app = express();
const cors = require('cors');
const GET = require('./lib/get.js');
const POST = require('./lib/post.js');
const PUT = require('./lib/put.js');
const DELETE = require('./lib/delete.js');
const client = require('./lib/mongo.js');

app.use(cors());
app.use(express.json());

const port = 8080;
app.listen(port, () => {
  console.log('Server started on port', port);
});

client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
});

function getCollectionFromUrl(url) {
  if (url.startsWith('/users/')) {
    return 'users';
  } else if (url.startsWith('/blogs/')) {
    return 'blogs';
  } else if (url.startsWith('/comments/')) {
    return 'comments';
  } else {
    return null;
  }
}

app.all('*', (req, res, next) => {
  const collection = getCollectionFromUrl(req.url);
  
  if (!collection) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  req.collection = collection;
  next();
});

app.post('*', (req, res) => POST(req, res, req.collection));
app.put('*', (req, res) => PUT(req, res, req.collection));
app.get('*', (req, res) => GET(req, res, req.collection));
app.delete('*', (req, res) => DELETE(req, res, req.collection));
