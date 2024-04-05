'use server';

import { CreateCategoryPayload } from "@/types"
import connectDB from "../database";
import Category from "../database/models/categories.model";
import { handleError } from "../utils";

export const getCategoryByName = async (name: string) => {
  return await Category.findOne({ name: { $regex: name, $options: 'i' } })
}

export const createCategory = async (category: CreateCategoryPayload) => {
  try {
    await connectDB();
    //console.log('test: ',category);
    const newCategory = await Category.create({ name: category.name })

    return JSON.parse(JSON.stringify(newCategory));
  }
  catch(error) {
    handleError(error);
  }
}

export const getCategories = async () => {
  try {
    await connectDB();

    const categories = await Category.find();
    return JSON.parse(JSON.stringify(categories));
  }
  catch(error) {
    handleError(error);
  }
}