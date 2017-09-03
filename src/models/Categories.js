import { connection, Schema } from '../config/mongoose';

export const CategorySchema = new Schema({
  id: { type: String, unique: true },
  name: String,
});

export const Category = connection.model('Category', CategorySchema);
