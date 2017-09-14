import _ from 'lodash';
import Promise from 'bluebird';
import BreweryApiService from './BreweryApiService';
import { Brewery } from '../models/Breweries';

const BreweryCollection = 'breweries';

async function createBreweryIndex() {
  const db =  await MongoDb();
  const breweryCollection = Promise.promisifyAll(db.collection(this.collection));

  try {
    breweryCollection.createIndex({
      name : 'text',
      nameShortDisplay : 'text',
      description: 'text'
    });
  } catch (err) {
    console.log(err);
  }
}

async function populateLocationForBreweries() {
  const noOfBreweries = await Brewery.count({});

  const perPage = 20;

  const noOfPages = Math.ceil(noOfBreweries / perPage);

  _.range(0, noOfPages)
    .map(page => () => breweriesLocationBatchUpdate(page, perPage))
    .reduce((promise, funcToCall) => promise.then(funcToCall), Promise.resolve());  
}

async function breweriesLocationBatchUpdate(page, perPage) {
  const breweries = await Brewery.find({}, null, {
    skip: perPage * page,
    limit: perPage,
  });

  const breweryUpdates = breweries.map(brewery => updateBreweryCountry(brewery));

  return Promise.all(breweryUpdates);  
}

async function updateBreweryCountry(brewery) {
  const { locations } = brewery;
  if (locations === undefined || _(locations).isEmpty()) return;
    
  const { countryIsoCode, region } = locations.filter(location => 
    (location.isPrimary === 'Y')
  ).reduce((acc, loc) => _.assign(acc,loc), {});

  console.log('Processing brewery', brewery.name);

  return Brewery.update({ id: brewery.id }, { country: countryIsoCode, city: region });
}

async function populateBreweriesFromApi() {
  const noOfPages = await BreweryApiService.fetchNoOfBreweryPages();

  _.range(1, noOfPages + 1)
    .map(page => () => handleBreweriesPage(page))
    .reduce(
      (promise, funcToCall) => promise.finally(funcToCall).catch(funcToCall)
    , Promise.resolve());
}

async function importBreweryToDb(brewery) {
  const _brewery = new Brewery({
    id: brewery.id,
    name: brewery.name,
    website: brewery.website,
    description: brewery.description,
    images: brewery.images,
    locations: brewery.locations,
    alternateNames: brewery.alternateNames
  });

  return _brewery.save();
}

async function handleBreweriesPage(page) {
  const { data } = await BreweryApiService.fetchBreweries(page);
    
  return Promise.all(data.map(brewery => importBreweryToDb(brewery)));  
}

async function updateCitiesName() {
  const breweries = await Brewery.find({});

  breweries.forEach(async ({ _id, name, city }) => {
    if (city === undefined || city === null) return;

    await Brewery.update({ id: _id }, { cityName: city});
    console.log(` Updating ${name} @ ${city}`);
  }); 
}  

const BreweryService = {
  populateBreweriesFromApi,
  populateLocationForBreweries,
  updateCitiesName,
};

export default BreweryService;
