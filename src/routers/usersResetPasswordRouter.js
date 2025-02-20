import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import {
  requestAuthUserResetEmailSchema,
  resetAuthUserPasswordSchema,
} from '../validation/authValidation.js';
import {
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/usersResetPasswordController.js';

const router = Router();

router.post(
  '/send-reset-email',
  validateBody(requestAuthUserResetEmailSchema),
  controllerWrapper(requestResetEmailController),
);

router.post(
  '/reset-pswrd',
  validateBody(resetAuthUserPasswordSchema),
  controllerWrapper(resetPasswordController),
);

export default router;