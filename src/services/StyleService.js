import Promise from 'bluebird';
import MongoDb from '../config/database_mongo';
import BreweryApiService from './BreweryApiService';
import { Style } from '../models/Styles';
import { Category } from '../models/Categories';

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


async function linkStylesWithCategories() {
  try {
    const styles = await Style.find({});

    styles
      .map(style => () =>  linkStyleToCategories(style))
      .reduce((promise, funcToCall) => promise.then(funcToCall), Promise.resolve());
  } catch(err) {
    console.log(err);
  }
}

async function linkStyleToCategories(style) {
  const { categoryId } = style;
  
  const _category = await Category.findOne({ id: categoryId });


  if (!_category) return;

  console.log('Update style', style.name, _category.name);

  return Style.update({ _id: style._id }, { category: _category._id});
}

async function listStylesWithCategories() {
  const styles = await Style.find().populate('category').exec();

  styles.forEach((style) => {
    console.log(style.name, style.category);
  });
}

const StylesService = {
  populateStylesFromApi,
  linkStylesWithCategories,
  listStylesWithCategories
};

export default StylesService;