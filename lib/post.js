const fs=require('fs');

function POST(req, res) {
    // code for handling POST requests
    console.log(req.method); // logs the HTTP method to the console
     //function that generates a unique ID
    function generateUniqueId() {
      return Date.now().toString(36) + Math.random().toString(36);
    }
    const id = generateUniqueId(); 
    // Write to a file
    let new_file = `${id}.json`; // generate a filename based on the unique ID
    
    // Parse the request body as a JSON object
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
        let data;
        try {
          data = JSON.parse(body);
        } catch (err) {
          res.statusCode = 400; // Bad Request
          res.end("Invalid JSON format");
          return;
        }
        data.id = id;
       
      // Write the JSON object to the file
      fs.writeFileSync(`./data/${new_file}`, JSON.stringify(data, null, 2));
  
      // Send a response with the ID and file path
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 201;
      res.end(JSON.stringify({
        id: id,
        file_path: `./data/${new_file}`
      }));
    });
  }
  module.exports=POST