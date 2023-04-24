const GET =require('./lib/get.js');
const POST=require('./lib/post.js');
const PUT=require('./lib/put.js');
const DELETE=require('./lib/delete.js');
const http=require('http');
const server=http.createServer((req,res)=>{
	  // Set CORS headers
	  res.setHeader('Access-Control-Allow-Origin', '*');
	  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});
 var port = 8080
server.listen(port, () => {
	console.log('Server started on port', port);
  });

server.on('request',async(req,res)=>{
	console.log(req.method)
	switch (req.method) {
		case "POST":
		  POST(req, res);
		  break;
		case "PUT":
		  PUT(req, res);
		  break;
		case "GET":
		  GET(req, res);
		  break;
		case "DELETE":
		  DELETE(req, res);
		  break;
		default:
		  res.statusCode = 405;
		  res.end("Method Not Allowed");
	  }	  	  	  
});


