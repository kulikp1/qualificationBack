import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import { usersUpdateSchema } from '../validation/users.js';
import { usersUpdateController } from '../controllers/usersUpdateController.js';

const router = Router();

router.patch(
  '/update',
  auth,
  validateBody(usersUpdateSchema),
  controllerWrapper(usersUpdateController),
);

export default router;