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
    if (parsedUrl.pathname === '/addUser') {
      parseBody(request, response, jsonHandler.addUser);
    }
};

// handle GET requests
const handleGet = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
    } else if (parsedUrl.pathname === '/') {
        htmlHandler.getIndex(request, response);
    }else if (parsedUrl.pathname === '/getUsers') {
        jsonHandler.getUsers(request, response);
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
