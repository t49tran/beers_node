import { connection, Schema } from '../config/mongoose';

export const StyleSchema = new Schema({
  id: String,
  categoryId: String,
  category: Object,
  name: String,
  shortName: String,
  description: String,
});

export const Style = connection.model('Style', StyleSchema);
