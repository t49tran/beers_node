import Promise from 'bluebird';
import BreweryApiService from './BreweryApiService';
import { Brewery, City, Country } from '../models'; 

async function populateCities() {
  const breweries = await Brewery.where('city').ne(null);

  breweries
    .map(({ city, country }) => () => createCity({ city, country }))
    .reduce((promise, funcToCall) => promise.finally(funcToCall)
      , Promise.resolve());
}

async function createCity({ city, country }) {
  console.log(`Processing ${city} ${country}`);

  const _country = await Country.findOne({ isoCode: country });

  const _city = new City({ name: city, countryCode: country, country: _country ? _country._id : undefined });
  return _city.save();
}

async function listCities() {
  const cities = await City.find({});

  cities.forEach((city) => {
    console.log(city);
  });
}

const CitiesService = {
  populateCities,
  listCities,
}

export default CitiesService;