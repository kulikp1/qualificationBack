import { Router } from 'express';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import { getGoogleOAuthUrlController, loginWithGoogleController } from '../controllers/authUserController.js';
import { loginWithGoogleOAuthSchema } from '../validation/authValidation.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.get('/get-oauth-url', controllerWrapper(getGoogleOAuthUrlController));

router.post(
  '/confirm-google-auth',
  validateBody(loginWithGoogleOAuthSchema),
  controllerWrapper(loginWithGoogleController),
);

export default router;