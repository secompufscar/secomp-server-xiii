import { createCategory }from "./createCategoryController"
import { getAllCategories } from './getAllCategoriesController';
import { updateCategory } from './updateCategoryController';
import { deleteCategory } from './deleteCategoryController'; 
import { getCategoryById } from "./getCategoryById";

export default {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
};