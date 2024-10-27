const fs = require("fs");
const http = require("http");
const url = require("url");
// const sholwtxt = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(sholwtxt);
// const textout = `this is now we now about avocado ${sholwtxt}`;
// fs.writeFileSync("./txt/output.txt", textout);
// console.log("file is written");
//non blocking ,asyncronous way
//callbackHell
// fs.readFile("./txt/start.txt", "utf-8", (error, data) => {
//   console.log(data);
// });
// fs.readFile("./txt/start.txt", "utf-8", (error, data1) => {
//   if (error) return console.log("ERROR😩");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (error, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2}\n ${data3}`,
//         "utf-8",
//         (error) => {
//           console.log("file is written");
//         }
//       );
//     });
//   });
// });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//server
//1.create server

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients); // Fixed the property name
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  // Check if product is organic and set class accordingly
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  } else {
    output = output.replace(/{%NOT_ORGANIC%}/g, ""); // Remove class if organic
  }

  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const temptCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const cardHtml = dataObj
      .map((el) => replaceTemplate(temptCard, el))
      .join("");
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    const product = dataObj.find((el) => el.id === Number(query.id)); // Find the product by ID
    if (product) {
      res.writeHead(200, { "Content-Type": "text/html" });
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>Product not found</h1>");
    }

    // API page
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    // Not Found Page
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

// Start server
server.listen(8000, "127.0.0.1", () => {
  console.log("Server is running on http://127.0.0.1:8000");
});
