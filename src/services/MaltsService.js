import MongoDb from "../config/database_mongo";
import BreweryWs from "../config/brewery_api_handler";

import Promise from "bluebird";

class MaltsService{
    constructor(){
        this.collection = "malts";
    }

    async populateMalts(){
        let db = await MongoDb();
        let brewery_ws = BreweryWs();

        let maltsCollection = db.collection(this.collection);
        Promise.promisifyAll(maltsCollection);

        let page = 1;
        let totalPage = 1;

        do{
            console.log(`Processing page ${page}`);

            try{
                let results = await brewery_ws.fetchMalts(page);

                if(! results.data && results.length) continue;

                for (let malt of results.data){
                    try{
                        let m_document = await maltsCollection.findOne({id: malt.id});
                        if(m_document) continue;

                        maltsCollection.insertOne(malt);
                    }catch(err){
                        console.log(err);
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

export {MaltsService};