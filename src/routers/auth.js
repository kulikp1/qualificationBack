import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userRegistrationSchema } from '../validation/userRegistrationSchema.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { userLoginSchema } from '../validation/userLoginSchema.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userRegistrationSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  '/login',
  validateBody(userLoginSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post('/refresh', ctrlWrapper(refreshSessionController));

authRouter.post('/logout', ctrlWrapper(logoutUserController));

export default authRouter;