import MongoDb from "../config/database_mongo";
import BreweryWs from "../config/brewery_api_handler";

var sleep = require('sleep');
var Promise = require("bluebird");

class YeastsService {

    constructor(){
        this.collection = "yeasts";
    }

    async populateYeasts(){
        let db = await MongoDb();

        let brewery_ws = BreweryWs();
        let yeastsCollection = db.collection(this.collection);

        Promise.promisifyAll(yeastsCollection);

        let page = 1;
        let totalPage = 1;

        do {
            console.log(`Processing page ${page}`);

            try{
                let results = await brewery_ws.fetchYeasts(page);

                if(results.data && results.data.length){
                    for(let yeast of results.data){

                        try{
                            let y_document = await yeastsCollection.findOne({id: yeast.id});

                            if(y_document) continue;

                            yeastsCollection.insertOne(yeast);

                        }catch(error){
                            console.log(error);
                        }
                    }
                }

                page = results.currentPage + 1;
                totalPage = results.numberOfPages;

            }catch(err){
                console.log(err);
            }

        } while(page <= totalPage);
    }
}

export {YeastsService};