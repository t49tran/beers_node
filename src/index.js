import StylesService from './services/StyleService';
import CategoryService from './services/CategoryService';

try {
  //StylesService.populateStylesFromApi();

  CategoryService.populateCategoriesFromApi();
} catch(err) {
  console.log(err);
}
