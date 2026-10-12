import 'dotenv/config'
import http from 'node:http'

const server = http.createServer((req, res) => {
  res.end("Welcome to my backend");
});

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Invalid port");
}

server.listen(port, () => {
  console.log("Server running on port", port);
});

const http = require("node:http");
