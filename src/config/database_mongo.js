/**
 * Setting up Mongo database here
 */
import {ConfigService} from "../services/ConfigService";
import {MongoService} from "../services/MongoService";

class MongoDb {
    static async getClient() {
        const config = ConfigService.parse(__dirname+"/parameters.yml");

        if (this.mongo_client) return this.mongo_client;

        this.mongo_client = await MongoService.connect(config.database.mongo);

        return this.mongo_client;
    }
}

export default async function() {
    return MongoDb.getClient();
};

