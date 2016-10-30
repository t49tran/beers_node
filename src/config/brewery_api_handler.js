import {BreweryApiService} from "../services/BreweryApiService";
import {ConfigService} from "../services/ConfigService";

let BreweryWs = function(){

    var config =  ConfigService.parse(__dirname+"/parameters.yml");

    let brewery_ws = new BreweryApiService(config.brewery_api.url, config.brewery_api.api_key);

    return brewery_ws;
};

export default BreweryWs;