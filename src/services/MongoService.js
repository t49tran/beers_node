var MongoClient = require('mongodb').MongoClient;

var Promise = require("bluebird");

Promise.promisifyAll(MongoClient);

class MongoService{
    static async connect(db_config){
        if(!db_config || !db_config.host || !db_config.port || !db_config.db) return null;

        let connection_string = `mongodb://${db_config.host}:${db_config.port}/${db_config.db}`;

        return MongoClient.connectAsync(connection_string);
    }

    get instance(){
    }
}

export {MongoService};