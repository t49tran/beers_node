import MongoDb from '../config/database_mongo';
import Promise from 'bluebird';

import BreweryApiService from './BreweryApiService';
import { Category } from '../models/Categories'; 

const CategoryCollection = 'categories';

async function createCategoriesIndex() {
  const db = await MongoDb();
  const categoriesCollection = Promise.promisifyAll(db.collection(CategoryCollection));

  try {
    categoriesCollection.createIndex({ name: 'text' });
  } catch(err) {
    console.log(err);
  }
}

async function importCategoryToDb(data) {
  const category = new Category({
    id: data.id,
    name: data.name,
  });

  return category.save();
}

async function populateCategoriesFromApi() {
  try {
    const categories = await BreweryApiService.fetchCategories();


    const { data = [] } = categories;

    data
      .map(category => () => importCategoryToDb(category))
      .reduce((promiseToCall, categoryFunc) => promiseToCall.then(categoryFunc)
        , Promise.resolve());
  } catch(err) {
    console.log(err);
  }
}

const CategoriesService = {
  createCategoriesIndex,
  populateCategoriesFromApi,
}

export default CategoriesService;