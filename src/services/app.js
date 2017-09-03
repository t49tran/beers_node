'use strict';

var _StylesService = require('./services/StylesService');

var _StylesService2 = _interopRequireDefault(_StylesService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

try {
  _StylesService2.default.populateStylesFromApi();
} catch (err) {
  console.log(err);
}
