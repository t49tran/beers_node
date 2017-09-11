import Promise from 'bluebird';
import BreweryApiService from './BreweryApiService';
import { Brewery, City } from '../models'; 

async function populateCities() {
  const breweries = await Brewery.where('city').ne(null);

  breweries
    .map(({ city, country }) => () => createCity({ city, country }))
    .reduce((promise, funcToCall) => promise.then(funcToCall)
      , Promise.resolve());
}

async function createCity({ city, country }) {
  console.log(`Processing ${city} ${country}`);

  const _city = new City({ city, country });
  return _city.save();
}

const CitiesService = {
  populateCities,
}

export default CitiesService;