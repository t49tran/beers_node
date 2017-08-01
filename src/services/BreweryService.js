import MongoDb from "../config/database_mongo";
import BreweryWs from "../config/brewery_api_handler";
import _ from "lodash";
import {BeersService} from "./BeersService";

var Promise = require("bluebird");

class BreweryService {
  constructor() {
    // TODO: convert collection names to const and separate them to their own files
    this.collection = 'breweries';
    this.beers_collection = 'beers';

    this.$beersService = new BeersService();
  }

  async populateBreweryBeers() {
    const db =  await MongoDb();
    const beers_collection = Promise.promisifyAll(db.collection(this.$beersService.collection));
    const breweries_cursor = Promise.promisifyAll(db.collection(this.collection).find({ beers:null, has_no_beer:false }));
    const breweries = await breweries_cursor.toArray();

    const breweries_updated = await breweries.map(brewery => () => this.updateSingleBreweryBeers(brewery))
      .reduce((promise_to_call, update_fn) => promise_to_call.then(update_fn),
        Promise.resolve());

    console.log('Finish populating all breweries');
  }

  async updateSingleBreweryBeers() {
    const brewery_ws = BreweryWs();
    const brewery_collection = Promise.promisifyAll(db.collection(this.collection));

    console.log(`Processing ${brewery.name}`);
    try {
      const bws_response = await brewery_ws.fetchBreweriesBeers(brewery.id);

      if (bws_response.status!=='success') return;

      if (bws_response.data === undefined || bws_response.data.length <= 0) {
        console.log(`No beer found for ${brewery.name}`);

        return brewery_collection.findOneAndUpdate({_id:brewery._id}, {
          $set: {'has_no_beer':true}
        });
      } else {
        const beers_list = bws_response.data.reduce((list, beer) => {
          list.push(beer.id);

          beers_collection.findOneAndUpdate({id:beer.id}, {
            $set : {'brewery': brewery}
          });

          return list;
        }, []);

        return brewery_collection.findOneAndUpdate({'_id':brewery._id}, {
          $set: {'beers': beers_list}
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  async findBreweryLocation() {
    const db =  await MongoDb();
    const breweries_cursor = db.collection(this.collection).find({locations:null});

    Promise.promisifyAll(breweries_cursor);

    const breweries = await breweries_cursor.toArray();

    if (breweries === undefined || breweries.length <= 0) {
      return Promise.reject({error:'No breweries found'});
    }
    try {
      const breweries_updated = await breweries
      .map(brewery => () => this.updateSingleBreweryLocation(brewery))
      .reduce((promise_to_call, update_fn) => promise_to_call.then(update_fn), Promise.resolve());

      console.log('Update breweries\' locations successfully');
    } catch(err) {
      console.log(err);
    }
  }

  async updateSingleBreweryLocation(brewery) {
    try {
      const db =  await MongoDb();
      const brewery_ws = BreweryWs();
      const brewery_collection = Promise.promisifyAll(db.collection(this.collection));
      const bws_response = await brewery_ws.findBreweryLocation(brewery.id);

      if (bws_response.status !=='success') return Promise.reject({err: 'API query failed'});

      if (bws_response.data === undefined ||
        bws_response.data.length <= 0) {
        return Promise.resolve({message: 'Data not found'});
      }

      const brewery_locations = bws_response.data.map(location => ({
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        countryIsoCode: location.countryIsoCode,
        locality: location.locality,
        streetAddress: location.streetAddress,
        openToPublic: location.openToPublic,
        isPrimary: location.isPrimary,
        isClosed: location.isClosed,
      }));

      return await brewery_collection.findOneAndUpdate({_id:brewery._id}, {
        $set: {locations: brewery_locations}
      });
    } catch(err) {
      console.log(err);
    }
  }

  async populateLocationForBreweries() {
    const db = await MongoDb();

    // Only update record having no record for country
    const breweries_cursor = db.collection(this.collection).find({ country: { $exists: false } });

    Promise.promisifyAll(breweries_cursor);

    const breweries = await breweries_cursor.toArray();

    if(breweries === undefined || breweries.length <= 0) return Promise.reject({error:'No breweries found'});

    return await breweries.map((brewery) => () => this.updateBreweriesCountry(brewery))
      .reduce((promise_to_call, update_function) => promise_to_call.then(update_function), Promise.resolve());
  }

  async updateBreweriesCountry(brewery) {
    try {
      const db = await MongoDb();
      console.log(`Processing brewery ${brewery.name}`);

      if (brewery.locations === undefined || brewery.locations.length <= 0) return;

      const brewery_collection = Promise.promisifyAll(db.collection(this.collection));
      const primary_location = brewery.locations.filter(location => (location.isPrimary === 'Y'));

      if (primary_location === undefined || primary_location.length <= 0) return;

      console.log(`Primary location found: ${primary_location}`);

      const country = primary_location[0].countryIsoCode;

      brewery_collection.findOneAndUpdate({ _id: brewery._id }, { $set: { country: country } })

      return this.updateBeersCountry(brewery.beers, country);
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async updateBeersCountry(beer_ids, country) {
    try {
      const db = await MongoDb();
      const beer_collection = Promise.promisifyAll(db.collection(this.beers_collection));

      if (beer_ids === undefined || beer_ids.length <= 0) return;

      // Get all brewery's beers and update them with country iso code as well
      const beers_cursor = Promise.promisifyAll(db.collection(this.beers_collection).find({ id: { $in: beer_ids } }));

      const beers = await beers_cursor.toArray();

      beers.forEach((beer) => {
        beer_collection.findOneAndUpdate({ _id: beer._id }, { $set: { country: country } });
      });
    } catch(err) {
      console.log(err);
    }
  }

  async createBreweryIndex() {
    const db =  await MongoDb();
    const breweryCollection = Promise.promisifyAll(db.collection(this.collection));

    try {
      breweryCollection.createIndex({
        name : 'text',
        nameShortDisplay : 'text',
        description: 'text'
      });

      console.log('Creating brewery index');
    } catch (err) {
      console.log(err);
    }
  }
}

export default BreweryService;
