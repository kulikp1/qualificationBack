
import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { authDataUserRouterController } from '../controllers/authDataUserRouterController.js';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import { patchUserPhotoController } from '../controllers/authUserController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.get('/data', auth, controllerWrapper(authDataUserRouterController));

router.patch(
  '/photo',
  auth,
  upload.single('photo'),
  controllerWrapper(patchUserPhotoController),
);

export default router;
