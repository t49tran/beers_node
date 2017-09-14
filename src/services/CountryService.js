import Promise from 'bluebird';
import _ from 'lodash';
import { Brewery, Country } from '../models'

const countriesData = require('../config/countries.json');

const populateCountries = async function populateCountries() {
  try {
    const breweries = await Brewery.where('country').ne(null);

    const countryCodes = _.uniq(breweries.map(brewery => brewery.country));

    countryCodes
      .map(countryCode => () => createCountryFromCode(countryCode))
      .reduce((promise, funcToCall) => promise.then(funcToCall), Promise.resolve())
    ;
  } catch(err) {
    return Promise.reject(err);
  }
}

async function createCountryFromCode(country) {
  console.log(`Processing country ${country} ${countriesData[country]}`);

  const _country = new Country({
    name: countriesData[country],
    isoCode: country
  });

  return _country.save();
};

async function populateCountryCities() {
  
}

const CountriesService = {
  populateCountries,
};

export default CountriesService;
