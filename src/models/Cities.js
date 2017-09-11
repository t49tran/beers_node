import { connection, Schema } from '../config/mongoose';

export const CitySchema = new Schema({
  name: String,
  country: String,
});

export const City = connection.model('City', CitySchema);
