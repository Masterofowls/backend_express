const http = require("node:http");

const server = http.createServer((req, res) => {
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");

  res.end(JSON.stringify({
    error: "Product not found"
  }));
});

server.listen(3000);