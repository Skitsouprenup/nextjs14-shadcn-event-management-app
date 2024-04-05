import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
})

const Category = models?.Categories || model('Categories', CategorySchema);

export default Category;