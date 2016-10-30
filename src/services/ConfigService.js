var fs   = require('fs');
var yaml = require('js-yaml');

class ConfigService{

    static parse(yml_file){
        let config = yaml.safeLoad(fs.readFileSync(yml_file));

        return config;
    }

}

export {ConfigService};