import MongoDb from "../config/database_mongo";
import Brewery_Ws from "../config/brewery_api_handler";

import Promise from "bluebird";

class HopsService{

    constructor(){
        this.collection = "hops";
    }

    async populateHops(){
        let db = await MongoDb();
        let brewery_ws  = Brewery_Ws();

        let hopsCollection = db.collection(this.collection);
        Promise.promisifyAll(hopsCollection);

        let page = 1;
        let totalPage = 1;

        do{
            console.log(`Processing page ${page}`);

            try{
                let results = await brewery_ws.fetchHops(page);
                if(!results.data || !results.data.length) continue;
                for(let hop of results.data){
                    let h_document = await hopsCollection.findOne({id: hop.id});
                    if(h_document) continue;
                    console.log(hop.name);
                    hopsCollection.insertOne(hop);
                }
                page = results.currentPage + 1;
                totalPage = results.numberOfPages;
            }catch(err){
                console.log(err);
            }

        } while(page <= totalPage);
    }

}

export {HopsService};