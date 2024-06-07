import express from 'express';
import categoryController from '../controllers/category/categoriesController';
import validate from '../middlewares/validate'
import { createCategorySchema, updateCategorySchema, categoryIdSchema } from '../schemas/categorySchema';


const router = express.Router();

router.post('/', validate(createCategorySchema), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', validate(undefined, categoryIdSchema), categoryController.getCategoryById)
router.delete('/:id', validate(undefined, categoryIdSchema), categoryController.deleteCategory);
router.put('/:id', validate(updateCategorySchema, categoryIdSchema),categoryController.updateCategory);

export default router;
