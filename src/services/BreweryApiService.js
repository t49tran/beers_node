import rp from 'request-promise';
import Promise from 'bluebird';
import Parameters from '../config/parameters';

const { BREWERY_DB } = Parameters || {};

function ConfigMissingException({ message }) {
  return {
    message,
    name: 'ConfigMissingException',
  };
}

function checkBreweryAPIConfiguration() {
  if ( 
    BREWERY_DB === undefined || 
    BREWERY_DB.API_ENDPOINT === undefined ||
    BREWERY_DB.API_KEY === undefined
  ) {
    throw ConfigMissingException({
      message: 'Brewery Db configurations not found',
    })
  }
}

async function fetchBeers() {
  checkBreweryAPIConfiguration();
}

async function fetchBreweries() {
  checkBreweryAPIConfiguration();
}

/**
 * Fetching styles information from the breweries database api
**/
async function fetchStyles() {
  try {
    checkBreweryAPIConfiguration();

    const apiUrl = `${BREWERY_DB.API_ENDPOINT}/styles?key=${BREWERY_DB.API_KEY}`;

    return rp({ uri: apiUrl, json: true });
  } catch(err) {
    console.log(err);
  }
}

/**
 * Fetching categories information from the breweries database api
**/
async function fetchCategories() {
  checkBreweryAPIConfiguration();

  const apiUrl = `${BREWERY_DB.API_ENDPOINT}/categories?key=${BREWERY_DB.API_KEY}`;

  return rp({ uri: apiUrl, json: true });
}

async function fetchBreweriesBeers(brewery_id) {
  const { BREWERY_DB } = Parameters || {};

  if ( 
    BREWERY_DB === undefined || 
    BREWERY_DB.API_ENDPOINT === undefined ||
    BREWERY_DB.API_KEY === undefined
  ) {
    throw ConfigMissingException({
      message: 'Brewery Db configurations not found',
    })
  }

  const apiUrl = `${BREWERY_DB.API_ENDPOINT}/brewery/${brewery_id}/beers?key=${BREWERY_DB.API_KEY}`;

  return rp({ uri: apiUrl, json: true });
}

/**
 * Fetching yeasts information from the breweries database api
**/
async function fetchYeasts(page_id = 1) {
  const { BREWERY_DB } = Parameters || {};

  if ( 
    BREWERY_DB === undefined || 
    BREWERY_DB.API_ENDPOINT === undefined ||
    BREWERY_DB.API_KEY === undefined
  ) {
    throw ConfigMissingException({
      message: 'Brewery Db configurations not found',
    })
  }

  const apiUrl = `${BREWERY_DB.API_ENDPOINT}/yeasts?key=${BREWERY_DB.API_KEY}&p=${page_id}`;

  return rp({ uri: apiUrl, json: true });
}

async function fetchMalts(page_id = 1) {
  checkBreweryAPIConfiguration();

  const apiUrl = `${BREWERY_DB.API_ENDPOINT}/fermentables?key=${BREWERY_DB.API_KEY}&p=${page_id}`;

  return rp({ uri: apiUrl, json: true });
}

async function fetchHops(page_id = 1) {
  checkBreweryAPIConfiguration();

  const apiUrl = `${BREWERY_DB.API_ENDPOINT}/hops?key=${BREWERY_DB.API_KEY}&p=${page_id}`;

  return rp({ uri: apiUrl, json: true });
}

async function fetchBeerIngredients(beer_id) {
  checkBreweryAPIConfiguration();

  const apiUrl = `${BREWERY_DB.API_ENDPOINT}/beer/${beer_id}/ingredients?key=${BREWERY_DB.API_KEY}`;

  return rp({ uri: apiUrl, json: true });
}

async function findBreweryLocation(brewery_id) {
  checkBreweryAPIConfiguration();

  if (brewery_id === undefined) {
    throw { message: 'Brewery id missing' }; 
  } 

  const apiUrl = `${BREWERY_DB.API_ENDPOINT}/brewery/${brewery_id}/locations?key=${BREWERY_DB.API_KEY}}`;

  return rp({ uri: apiUrl, json: true });
}

const BreweryAPIService = {
  fetchStyles,
  fetchCategories,
  findBreweryLocation,
};

export default BreweryAPIService;
