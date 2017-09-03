import Promise from 'bluebird';
import MongoDb from '../config/database_mongo';
import BreweryApiService from './BreweryApiService';
import { Style } from '../models/Styles';

const StyleCollection = 'styles';

async function populateStylesFromApi() {
  try {
    const { data = [] } = await BreweryApiService.fetchStyles();

    data
      .map(style => () => importStyleToDb(style))
      .reduce((promise, importStyleFn) => {
        return promise.then(importStyleFn);
      }, Promise.resolve());
  } catch(err) {
    console.log(err);
  }
}

async function importStyleToDb(data) {
  console.log('Processing', data.name);

  const style = new Style({
    id: data.id,
    name: data.name,
    shortName: data.shortName,
    description: data.description,
    categoryId: data.categoryId,
    category: data.category,
  });
  return style.save();
}

async function createStylesIndex() {
  const db = await MongoDb();

  const stylesCollection = Promise.promisifyAll(db.collection(StylesCollection));

  try {
    stylesCollection.createIndex({
      name : 'text',
      shortName : 'text',
      description: 'text',
    });

    console.log('Styles index created');
  } catch (err) {
    console.log(err);
  }
}

const StylesService = {
  createStylesIndex,
  populateStylesFromApi
};

export default StylesService;