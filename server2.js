/*
Method	Purpose	Example
GET	Retrieve data	GET /products
POST	Create a resource	POST /products
PUT	Replace a resource	PUT /products/42
PATCH	Partially update a resource	PATCH /products/42
DELETE	Delete a resource	DELETE /products/42
*/

const http = require("node:http");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/products") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const product = JSON.parse(body);

      console.log(product.name);
      console.log(product.price);

      res.statusCode = 201;
      res.end("Product created");
    });

    return;
  }

  res.statusCode = 404;
  res.end("Route not found");
});

server.listen(3001);

// validation
const product = {
    name: "Keyboard",
    price: -50
  };
  
  if (typeof product.name !== "string") {
    console.log("Name must be a string");
  } else if (typeof product.price !== "number" || product.price < 0) {
    console.log("Price must be a non-negative number");
  } else {
    console.log("Product is valid");
  }
