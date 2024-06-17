import express from 'express';
import categoryController from '../controllers/category/categoriesController';
import validate from '../middlewares/validate'
import { createCategorySchema, updateCategorySchema, categoryIdSchema } from '../schemas/categorySchema';
import { authMiddleware } from '../middlewares/authMiddleware'

const router = express.Router();

router.post('/',authMiddleware ,validate(createCategorySchema), categoryController.createCategory);
router.get('/', authMiddleware, categoryController.getAllCategories);
router.get('/:id',authMiddleware, validate(undefined, categoryIdSchema), categoryController.getCategoryById)
router.delete('/:id',authMiddleware, validate(undefined, categoryIdSchema), categoryController.deleteCategory);
router.put('/:id',authMiddleware, validate(updateCategorySchema, categoryIdSchema),categoryController.updateCategory);

export default router;
