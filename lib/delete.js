const fs = require('fs');
const url = require('url');

function DELETE(req, res) {
  let url_components = url.parse(req.url, true);
  console.log(url_components.pathname.split('/'));

  let filename = url_components.pathname.split('/')[1];
  
  if (!filename) {
    res.statusCode = 400;
    res.end("Missing 'id' parameter");
    return;
  }

  let filepath = `data/${filename}.json`;

  fs.unlink(filepath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end(`File '${filepath}' not found`);
      } else {
        // Other error
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
      }
    } else {
      // File deleted successfully
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(`File '${filepath}' deleted`);
    }
  });
}

module.exports = DELETE;
