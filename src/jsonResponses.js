// Requires
const fs = require('fs');

// JSON Read In
const countryData = JSON.parse(fs.readFileSync(`${__dirname}/../data/countries.json`));

// Respond function
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };
  response.writeHead(status, headers);
  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }
  response.end();
};

// Get Users
/*
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  return respondJSON(request, response, 200, responseJSON);
};

// Add User
const addUser = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };
  const { name, age } = request.body;

  if (!name || !age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;
  if (!users[name]) {
    responseCode = 201;
    users[name] = {
      name,
    };
  }
  users[name].age = age;
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSON(request, response, responseCode, {});
};
*/
// NOT REAL
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

// GET METHODS ----------------------------------
// Reminder: Use Find and Filter methods for searching
// Find Countries that has designated currency
const findCountry = (request, response) => {
  let responseJSON = {
    message: 'Currency is required.',
  };
  const currency = request.body;
  console.log(currency);

  if (!currency) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  
  let countries = '';
  for(let country in countryData){
    if(countryData[country].finance.currency = currency){
      countries = countries + countryData[country].name + ', ';
    }
  }
  responseJSON.message = countries;
  responseJSON.id = 'success';
  if (countries = ''){
    responseJSON.message = 'No data found.'
    responseJSON.id = 'missingParams';
    respondJSON(request, response, 404, responseJSON);
  }
  
  respondJSON(request, response, 200, responseJSON);
};

// Find the capital of the designated country
const findCapital = (request, response) => {

};

// Find the countries that are in the designated region add a subregion to filter search
const findCountries = (request, response) => {

};

// Find the symbol associated with the designated currency
const findSymbol = (request, response) => {

};

// POST METHODS -----------------------------------
// Remove the country
const removeCountry = (request, response) => {

};

// Change the currency of specified country to a new currency
const changeCurrency = (request, response) => {

};

// Exports
module.exports = {
  notReal,
  findCountry,
  findCapital,
  findCountries,
  findSymbol,
  removeCountry,
  changeCurrency,
};
