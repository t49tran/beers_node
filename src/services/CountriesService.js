// Loop through our list of breweries and pick up only country that is there
// Then add them to the database
import Promise from 'bluebird';
import _ from 'lodash';
import MongoDb from '../config/database_mongo';

const initTables = async function initTables() {
  const db = await MongoDb();
  const db_async = Promise.promisifyAll(db);

  try {
    const countries_table = await db_async.createCollection('countries');

    return Promise.resolve({message: 'Create countries table successfully'});
  } catch(err) {
    return Promise.reject(err);
  }
}

const populateCountries = async function populateCountries() {
  try {
    const db = await MongoDb();
    const breweriesCollection = Promise.promisifyAll(db.collection('breweries'));

    const breweries_cursor = await breweriesCollection.find({locations: {$exists: true}});
    const breweries = await Promise.promisifyAll(breweries_cursor).toArray();

    const countryCodes = breweries.map(brewery => _(brewery.locations).find(l => (l.isPrimary ==='Y')))
      .map(location => (location ? location.countryIsoCode : ''));

    const uniqueCountries = countryCodes.reduce((countries, code) => {
      if (countries.lastIndexOf(code) < 0 && code !=='') {
        countries.push(code);
      }

      return countries;
    }, []);

    const fs = Promise.promisifyAll(require('fs'));

    let countriesData = await fs.readFileAsync(__dirname+'/../config/countries.json', 'utf8');
    countriesData = JSON.parse(countriesData);

    return _(countriesData).map((name, code) => ({name, code}))
      .filter((country) => (uniqueCountries.lastIndexOf(country.code) >= 0))
      .map(country => () => createCountryFromCode(country))
      .reduce((promise_to_call, insert_fn) => promise_to_call.then(insert_fn), Promise.resolve());

  } catch(err) {
    return Promise.reject(err);
  }
}

async function createCountryFromCode(country) {
  console.log(`Inserting country ${country.name} ${country.code}`);

  const db = await MongoDb();
  const countriesCollection = Promise.promisifyAll(db.collection('countries'));
  try {
    return countriesCollection.insertOne(country);
  } catch(err) {
    Promise.reject(err);
  }
};

const CountriesService = {
  populateCountries,
  initTables,
};

export default CountriesService;
