import { connection, Schema } from '../config/mongoose';

export const StyleSchema = new Schema({
  id: String,
  categoryId: String,
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  name: String,
  shortName: String,
  description: String,
});

export const Style = connection.model('Style', StyleSchema);
