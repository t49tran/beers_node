import { connection, Schema } from '../config/mongoose';

export const CitySchema = new Schema({
  name: String,
  countryCode: String,
  country: { type: Schema.Types.ObjectId, ref: 'Country' }
});

CitySchema.index({name: 1, countryCode: -1}, {unique: true})

export const City = connection.model('City', CitySchema);
