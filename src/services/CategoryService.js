import MongoDb from "../config/database_mongo";
import BreweryWs from "../config/brewery_api_handler";
import Promise from "bluebird";

class CategoriesService {
    constructor() {
        this.collection = "categories";
    }

    async createCategoriesIndex() {
        let db = await MongoDb();

        let categoriesCollection = Promise.promisifyAll(db.collection(this.collection));

        try {
            categoriesCollection.createIndex({
                name: 'text'
            });
            console.log('Categories index created');
        } catch (err) {
            console.log(err);
        }
    }
}

export {CategoriesService};