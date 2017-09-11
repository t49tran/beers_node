import { connection, Schema } from '../config/mongoose';

export const CountrySchema = new Schema({
  isoCode: { type: String, unique: true },
  name: String,
});

export const Country = connection.model('Country', CountrySchema);
