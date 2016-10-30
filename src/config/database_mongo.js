/**
 * Setting up Mongo database here
 */
import {ConfigService} from "../services/ConfigService";
import {MongoService} from "../services/MongoService";

let MongoDb = async function(){

    var config =  ConfigService.parse(__dirname+"/parameters.yml");

    let mongo_client = await MongoService.connect(config.database.mongo);

    return mongo_client;
};

export default MongoDb;

