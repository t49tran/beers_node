import {ConfigService} from '../services/ConfigService';

const PARAMETERS =  ConfigService.parse(__dirname+"/parameters.yml");

export default PARAMETERS;
