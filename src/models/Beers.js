import { connection, Schema } from '../config/mongoose';

export const BeerSchema = new Schema({
  id: { type: String, unique: true },
  name: String,
  description: String,
  foodPairings: String,
  abv: String,
  ibu: Number,
  year: Number,
  styleId: String,
  breweryId: String,
});

export const Beer = connection.model('Beer', BeerSchema);
