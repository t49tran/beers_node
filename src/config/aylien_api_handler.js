import PARAMETERS from './parameters';
import AylienTextApi from 'aylien_textapi';
import Promise from 'bluebird';

let AylienClient = async function(){
    if(PARAMETERS.aylien === undefined) return Promise.reject({
        error:'Aylien app configuration missing'
    });

    let aylienClient = new AylienTextApi({
        application_id: PARAMETERS.aylien.app_id,
        application_key: PARAMETERS.aylien.app_key
    });

    return Promise.resolve({
        aylien: aylienClient
    });
};

export default AylienClient;

