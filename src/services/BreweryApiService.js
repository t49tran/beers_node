import rp from 'request-promise';
import Promise from 'bluebird';

class BreweryApiService {
  constructor(api_url, api_key) {
    this.api_url = api_url;
    this.api_key = api_key;
  }

  async fetchBreweriesBeers(brewery_id){
    const apiUrl = this.api_url+"brewery/"+brewery_id+"/beers"+ this.parseKeyUrl() ;

    return rp({
      uri: apiUrl,
      json: true,
    });
  }

  async fetchYeasts(page_id = 1) {
    const apiUrl = `${this.api_url}yeasts${this.parseKeyUrl()}&p=${page_id}`;

    return rp({
      uri: apiUrl,
      json: true,
    });
  }

  async fetchMalts(page_id = 1){
    const apiUrl = `${this.api_url}fermentables${this.parseKeyUrl()}&p=${page_id}`;

    return rp({
      uri: apiUrl,
      json: true,
    });
  }

  async fetchHops(page_id = 1){
    const apiUrl = `${this.api_url}hops${this.parseKeyUrl()}&p=${page_id}`;

    return rp({
      uri: apiUrl,
      json: true,
    });
  }

  async fetchBeerIngredients(beer_id){
    const apiUrl = `${this.api_url}beer/${beer_id}/ingredients${this.parseKeyUrl()}`;

    return rp({
      uri: apiUrl,
      json: true,
    });
  }

  async findBreweryLocation(brewery_id){
    if(brewery_id === undefined) return Promise.reject({error:'Brewery Id missing'});

    const apiUrl = `${this.api_url}brewery/${brewery_id}/locations${this.parseKeyUrl()}`;

    return rp({
      uri: apiUrl,
      json: true,
    });
  }

  parseKeyUrl() {
    return `?key=${this.api_key}`;
  }
}

export default BreweryApiService;
