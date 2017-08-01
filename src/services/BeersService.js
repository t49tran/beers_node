import MongoDb from '../config/database_mongo';
import BreweryWs from '../config/brewery_api_handler';
import Promise from 'bluebird';

class BeersService {
  constructor() {
    this.collection = 'beers';
  }

  async populateBeersIngredients() {
    const db =  await MongoDb();
    const brewery_ws = await BreweryWs();
    const beersCollection = Promise.promisifyAll(db.collection(this.collection));

    const beers_cursor = await beersCollection.find({ingredients: null});
    const beers = await Promise.promisifyAll(beers_cursor).toArray();

    if (!beers || !beers.length) {
      Promise.resolve({
        message: 'No beers querried',
      });
    }

    const beers_updated = await beers.map(beer => () => this.updateSingleBeerIngredients(beer))
      .reduce((promise_to_call, beer_update_fn) => promise_to_call.then(beer_update_fn), Promise.resolve());

    console.log('All beers ingredients populated', beers);
  }

  async updateSingleBeerIngredients(beer) {
    console.log(`Processing beer ${beer.name}`);

    const brewery_ws = await BreweryWs();
    const db =  await MongoDb();
    const beersCollection = Promise.promisifyAll(db.collection(this.collection));

    const results = await brewery_ws.fetchBeerIngredients(beer.id);

    if (results.status != 'success' || !results.data || !results.data.length) {
      console.log(`No ingredient found for ${beer.name}`);
      return beersCollection.findOneAndUpdate({'_id':beer._id}, {$set: {'ingredients':[]}});
    }

    console.log(`Ingredients updated for ${beer.name}`);
    return beersCollection.findOneAndUpdate({'_id': beer._id}, {$set: {'ingredients': results.data}});
  }

  async createBeersIndex() {
    const db =  await MongoDb();

    const beersCollection = Promise.promisifyAll(db.collection(this.collection));
    try {
      beersCollection.createIndex({
        name : 'text',
        nameDisplay : 'text',
        description: 'text',
        'brewery.name':'text'
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export {BeersService};