// Requires
const fs = require('fs');
const querystring = require('querystring');
const url = require('url');

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
  const responseJSON = {
    message: 'Currency is required.',
  };
  const parsed = url.parse(request.url);
  const query = querystring.parse(parsed.query);
  let { currency } = query;
  currency = currency.toLowerCase();
  currency = currency.charAt(0).toUpperCase() + currency.slice(1);

  if (!currency) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const countries = countryData.filter((country) => country.finance.currency_name === currency)
    .map((country) => country.name)
    .join(', ');

  if (!countries) {
    responseJSON.message = 'No data found.';
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 404, responseJSON);
  }

  responseJSON.message = countries;
  responseJSON.id = 'success';
  return respondJSON(request, response, 200, responseJSON);
};

// Find the capital of the designated country
const findCapital = (request, response) => {
  const responseJSON = {
    message: 'Country is required',
  };

  const parsed = url.parse(request.url);
  const query = querystring.parse(parsed.query);
  let { country } = query;
  country = country.toLowerCase();
  country = country.charAt(0).toUpperCase() + country.slice(1);

  if (!country) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const capitals = countryData.filter((country2) => country2.name === country)
    .map((country2) => country2.capital)
    .join(', ');

  if (!capitals) {
    responseJSON.message = 'No data found.';
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 404, responseJSON);
  }

  responseJSON.message = capitals;
  responseJSON.id = 'success';
  return respondJSON(request, response, 200, responseJSON);
};

// Find the countries that are in the designated region add a subregion to filter search
const findCountries = (request, response) => {
  const responseJSON = {
    message: 'Region is required',
  };

  const parsed = url.parse(request.url);
  const query = querystring.parse(parsed.query);
  let { region } = query;
  region = region.toLowerCase();
  region = region.charAt(0).toUpperCase() + region.slice(1);

  if (!region) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  let subregion;
  let countries;
  if (query.subregion) {
    subregion = query.subregion;
    subregion = subregion.toLowerCase();
    subregion = `${subregion.charAt(0).toUpperCase() + subregion.slice(1)} ${region}`;
    countries = countryData.filter((country) => country.subregion === subregion)
      .map((country) => country.name)
      .join(', ');
  } else {
    countries = countryData.filter((country) => country.region === region)
      .map((country) => country.name)
      .join(', ');
  }

  if (!countries) {
    responseJSON.message = 'No data found.';
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 404, responseJSON);
  }

  responseJSON.message = countries;
  responseJSON.id = 'success';
  return respondJSON(request, response, 200, responseJSON);
};

// Find the symbol associated with the designated currency
const findSymbol = (request, response) => {
  const responseJSON = {
    message: 'Currency is required.',
  };
  const parsed = url.parse(request.url);
  const query = querystring.parse(parsed.query);
  let { currency } = query;
  currency = currency.toLowerCase();
  currency = currency.charAt(0).toUpperCase() + currency.slice(1);

  if (!currency) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const country = countryData.find((c) => c.finance.currency_name === currency);

  if (!country) {
    responseJSON.message = 'No data found.';
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 404, responseJSON);
  }

  const symbol = country.finance.currency_symbol;

  responseJSON.message = symbol;
  responseJSON.id = 'success';
  return respondJSON(request, response, 200, responseJSON);
};

// POST METHODS -----------------------------------
// Remove the country
const removeCountry = (request, response) => {
  const responseJSON = {
    message: 'Country is required.',
  };
  const { country } = request.body;

  if (!country) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // Format the country name correctly
  const formattedCountry = country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();

  const countryIndex = countryData.findIndex((item) => item.name === formattedCountry);

  if (countryIndex === -1) {
    responseJSON.message = 'No data found.';
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 404, responseJSON);
  }

  // Remove the country from the data
  countryData.splice(countryIndex, 1);

  responseJSON.message = 'Country removed successfully.';
  responseJSON.id = 'success';
  return respondJSON(request, response, 200, responseJSON);
};

// Change the currency of specified country to a new currency
const changeCurrency = (request, response) => {
  const responseJSON = {
    message: 'Both country and currency are required.',
  };

  let { country, currency } = request.body;

  if (!country || !currency) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  country = country.toLowerCase();
  country = country.charAt(0).toUpperCase() + country.slice(1);

  currency = currency.toLowerCase();
  currency = currency.charAt(0).toUpperCase() + currency.slice(1);

  // Check if the country exists
  const countryDataEntry = countryData.find((c) => c.name === country);
  const countryWithCurr = countryData.find((c2) => c2.finance.currency_name === currency);

  if (!countryDataEntry) {
    responseJSON.message = 'Country not found.';
    responseJSON.id = 'notFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  if (!countryWithCurr) {
    responseJSON.message = 'Currency not found.';
    responseJSON.id = 'notFound';
    return respondJSON(request, response, 404, responseJSON);
  }

  // Update the currency
  countryDataEntry.finance.currency_name = currency;
  countryDataEntry.finance.currency = countryWithCurr.finance.currency;
  countryDataEntry.finance.currency_symbol = countryWithCurr.finance.currency_symbol;

  // Respond with success
  responseJSON.message = `Currency changed to ${currency} successfully for ${country}.`;
  responseJSON.id = 'success';
  return respondJSON(request, response, 200, responseJSON);
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
