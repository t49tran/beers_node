import BreweryApiService from '../services/BreweryApiService';
import {ConfigService} from '../services/ConfigService';
import _ from 'lodash';

const BreweryWs = _.memoize(function() {
  const config = ConfigService.parse(__dirname+"/parameters.yml");

  const brewery_ws = new BreweryApiService(config.brewery_api.url, config.brewery_api.api_key);

  return brewery_ws;
});

export default BreweryWs;