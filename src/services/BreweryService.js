import MongoDb from "../config/database_mongo";
import BreweryWs from "../config/brewery_api_handler";
import {BeersService} from "./BeersService";
var sleep = require('sleep');

var Promise = require("bluebird");

class BreweryService{
    constructor(){
        this.collection = "breweries";
        this.$beersService = new BeersService();
    }

    async populateBreweryBeers(){
        let db =  await MongoDb();
        let brewery_ws = BreweryWs();

        let breweries_cursor = db.collection(this.collection).find({beers:null,has_no_beer:false});

        Promise.promisifyAll(breweries_cursor);

        let breweries = await breweries_cursor.toArray();

        if(breweries){
            let counter = 0;
            for (let brewery of breweries){
                counter ++;
                if(brewery.beers && brewery.beers.length > 0) continue;

                setTimeout(()=>{
                    console.log(`Processing ${brewery.name}`);

                    let handler = brewery_ws.fetchBreweriesBeers(brewery.id);


                    let beers_collection = db.collection(this.$beersService.collection);
                    let brewery_collection = db.collection(this.collection);

                    handler.then((response) => {

                        if(response.status!="success") return;

                        if(response.data){
                            let beers_list = [];

                            Promise.promisifyAll(beers_collection);

                            for(let beer of response.data) {
                                beers_list.push(beer.id);

                                let beer_cursor = beers_collection.findOneAndUpdate({id:beer.id},{
                                    $set : {"brewery":brewery}
                                }).then((response)=>{
                                    console.log("Success",response);
                                }, (response)=>{
                                    console.log("Error",response);
                                });
                            }

                            let brewery_cursor = brewery_collection.findOneAndUpdate({"_id":brewery._id},{
                                $set: {"beers":beers_list}
                            }).then((response) => {
                                console.log("Update beers list successfully",response);
                            }, (response) => {
                                console.log("Error updating beers list",response);
                            });
                        }else{
                            console.log(response);

                            let brewery_cursor = brewery_collection.findOneAndUpdate({_id:brewery._id},{
                                $set: {"has_no_beer":true}
                            }).then((response) => {
                            },(response)=>{
                            });
                        }
                    },(response) => {
                        console.log("Error happened");
                    });
                },counter * 100);
            }
        }
    }
}

export {BreweryService};