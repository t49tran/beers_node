import mongoose, { Schema } from 'mongoose';
import Parameters from './parameters';

mongoose.Promise = require('bluebird');

const uri = `mongodb://${Parameters.MONGO_DB.HOST}:${Parameters.MONGO_DB.PORT}/${Parameters.MONGO_DB.DATABASE}`;

const connection = mongoose.createConnection(uri);

export { Schema, connection };

