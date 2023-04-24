const fs = require('fs');
const url = require('url');

function PUT(req, res) {
  const url_components = url.parse(req.url, true);
  const id = url_components.pathname.split('/')[1];

  if (!id) {
    // If 'id' parameter is missing, return a 400 Bad Request error
    res.statusCode = 400;
    res.end("Missing 'id' parameter");
    return;
  }

  const file_path = `./data/${id}.json`;

  if (!fs.existsSync(file_path)) {
    // If file does not exist, return a 404 Not Found error
    res.statusCode = 404;
    res.end("File not found");
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    // Read the request body
    body += chunk;
  });

  req.on("end", async () => {
    let data;
    try {
      // Try to parse the request body as JSON
      data = JSON.parse(body);
    } catch (err) {
      // If parsing fails, return a 400 Bad Request error
      res.statusCode = 400;
      res.end("Invalid JSON format");
      return;
    }

    let existing_data = [];

    try {
      // Try to read the existing data from the file
      existing_data = JSON.parse(await fs.promises.readFile(file_path, "utf-8"));
    } catch (err) {
      // If reading fails, return a 500 Internal Server Error with a message indicating the file contains invalid JSON data
      res.statusCode = 500;
      res.end("Internal Server Error. The file contains invalid JSON data");
      return;
    }

    if (!Array.isArray(existing_data)) {
      // If the existing data is not an array, return a 500 Internal Server Error with a message indicating the file does not contain an array
      res.statusCode = 500;
      res.end("Internal Server Error. The file does not contain an array");
      return;
    }

    existing_data.push(data);

    try {
      // Try to write the updated data to the file
      await fs.promises.writeFile(file_path, JSON.stringify(existing_data, null, 2));
    } catch (err) {
      // If writing fails, return a 500 Internal Server Error with a message indicating the write operation could not be completed
      res.statusCode = 500;
      res.end("Internal Server Error. Could not write to file");
      return;
    }

    // If everything succeeds, return a 200 OK response with the updated file path and ID
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify({
      id: id,
      file_path: file_path
    }));
  });
}

module.exports = PUT;
