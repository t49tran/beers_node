import { connection, Schema } from '../config/mongoose';

export const BrewerySchema = new Schema({
  id: { type: String, unique: true },
  name: String,
  description: String,
  website: String,
  established: String,
  country: String,
  city: String,
  images: Array,
  locations: Array,
  alternateNames: Array,
  beers: Array,
});

export const Brewery = connection.model('Brewery', BrewerySchema);
