import StyleService from './services/StyleService';
import CategoryService from './services/CategoryService';
import BreweryService from './services/BreweryService';
import CountryService from './services/CountryService';
import CityService from './services/CityService';
import BeerService from './services/BeerService';

try {
  //StylesService.populateStylesFromApi();
  //CategoryService.populateCategoriesFromApi();
  //BreweryService.populateBreweriesFromApi();
  //BreweryService.populateLocationForBreweries();
  //CountryService.populateCountries();
  //CityService.populateCities();
  //BeerService.populateBeersFromApi();
  //StyleService.linkStylesWithCategories();
  //StyleService.listStylesWithCategories();

  //CityService.listCities();
  //CityService.populateCities();
  
  BreweryService.updateCitiesName();
} catch(err) {
  console.log(err);
}
