import Promise from 'bluebird';
import BreweryApiService from './BreweryApiService';
import { Beer } from '../models/Beers';

async function populateBeersFromApi() {
  const noOfPages = await BreweryApiService.fetchNoOfBeerPages();

  _.range(1, noOfPages + 1)
    .map(page => () => batchImportBeers(page))
    .reduce((promise, funcToCall) => promise.finally(funcToCall), Promise.resolve());
}

async function batchImportBeers(page) {
  const { data } = await BreweryApiService.fetchBeers(page);

  return Promise.all(data.map(beer => importBeerToDb(beer)));
}

async function importBeerToDb(beer) {
  console.log('Importing beer to db', beer.name);
  const _beer = new Beer({
    name: beer.name,
    id: beer.id,
    description: beer.description,
    foodPairings: beer.foodPairings,
    abv: beer.abv,
    ibu: beer.ibu,
    year: beer.year,
    styleId: beer.style && beer.style.id || null,
    breweryId: beer.brewery && beer.brewery.id || null
  });

  return _beer.save();
}

const BeerService = {
  populateBeersFromApi,
};

export default BeerService;