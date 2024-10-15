// Requires
const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// Port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Parse Body
const parseBody = (request, response, handler) => {
  const body = [];
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    request.body = query.parse(bodyString);
    handler(request, response);
  });
};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/removeCountry') {
    parseBody(request, response, jsonHandler.removeCountry);
  } else if (parsedUrl.pathname === '/changeCurrency') {
    parseBody(request, response, jsonHandler.changeCurrency);
  }
};

// handle GET requests
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/findCountry') {
    jsonHandler.findCountry(request, response);
  } else if (parsedUrl.pathname === '/findCapital') {
    jsonHandler.findCapital(request, response);
  } else if (parsedUrl.pathname === '/findCountries') {
    jsonHandler.findCountries(request, response);
  } else if (parsedUrl.pathname === '/findSymbol') {
    jsonHandler.findSymbol(request, response);
  } else if (parsedUrl.pathname === '/docs') {
    htmlHandler.getDocumentation(request, response);
  } else {
    jsonHandler.notReal(request, response);
  }
};

// On Request Function
const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

// Server call back
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
