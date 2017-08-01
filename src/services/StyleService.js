import MongoDb from "../config/database_mongo";
import BreweryWs from "../config/brewery_api_handler";
import Promise from "bluebird";

class StylesService{
    constructor(){
        this.collection = "styles";
    }

    async createStylesIndex(){
        let db =  await MongoDb();

        let stylesCollection = Promise.promisifyAll(db.collection(this.collection));

        try{
            stylesCollection.createIndex({
                name : 'text',
                shortName : 'text',
                description: 'text',
            });
            console.log('Styles index created');
        } catch (err){
            console.log(err);
        }
    }
}

export {StylesService};