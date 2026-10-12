const http = require("node:http");

const server = http.createServer((req, res) => {
  res.end("Welcome to my backend");
});

const port = 3001

server.listen(port, () => {
  console.log("Server running on port", port);
});

/* 
Status	Meaning	Typical use
200 OK	Request succeeded	Successfully retrieving data
201 Created	Resource created	Successfully creating a user
400 Bad Request	Invalid request	Missing or invalid input
404 Not Found	Resource not found	Requested user doesn't exist
500 Internal Server Error	Unexpected server error	An unhandled server-side failure
*/

const server1 = http.createServer((req, res) => {
    res.statusCode = 404;
    res.end("Product not found");
  });

