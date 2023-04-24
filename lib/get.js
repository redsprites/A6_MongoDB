const fs = require('fs');
const url = require('url');

function getJSONData(path) {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading JSON data from ${path}: ${err}`);
    return null;
  }
}

function GET(req, res) {
  const urlComponents = url.parse(req.url, true);
  const pathComponents = urlComponents.pathname.split('/').slice(1); // remove empty first component

  if (pathComponents.length === 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing path parameter' }));
    return;
  }

  const filename = pathComponents[0];
  const filepath = `./data/${filename}.json`;

  if (!fs.existsSync(filepath)) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'File not found' }));
    return;
  }

  const data = getJSONData(filepath);

  if (!data) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Error reading data file' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

module.exports = GET;
