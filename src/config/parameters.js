import fs from 'fs';
import JsYaml from 'js-yaml';
const parameters_file = require('./parameters.yml');

const PARAMETERS = JsYaml.safeLoad(fs.readFileSync(parameters_file));

export default PARAMETERS;
