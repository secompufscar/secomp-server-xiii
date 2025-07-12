import { Router } from 'express';
import tagsController from '../controllers/tagsController';
// import { authMiddleware, adminMiddleware } from '../middlewares'; // Descomente para proteger

const routes = Router();

// Rotas já existentes
routes.get('/', tagsController.list);
routes.post('/', /* authMiddleware, adminMiddleware, */ tagsController.create);

// NOVAS ROTAS PARA UPDATE E DELETE
routes.patch('/:id', /* authMiddleware, adminMiddleware, */ tagsController.update);
routes.delete('/:id', /* authMiddleware, adminMiddleware, */ tagsController.delete);

export default routes;