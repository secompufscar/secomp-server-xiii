import express from 'express';
import categoryController from '../controllers/categoriesController';

const router = express.Router();

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.delete('/:id', categoryController.deleteCategory);
router.put('/:id', categoryController.updateCategory);

export default router;
