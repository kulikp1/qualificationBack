import { Router } from 'express';

import authUserRouter from './authUserRouter.js';
import authGoogleRouter from './authGoogleRouter.js';
import authDataUserRouter from './authDataUserRouter.js';
import usersResetPasswordRouter from './usersResetPasswordRouter.js';
import usersUpdateRouter from './usersUpdateRouter.js';

import { auth } from '../middlewares/auth.js';
import waterDataRouter from './waterDataRouter.js';
import swaggerDocs from '../middlewares/swaggerDocs.js';

const router = Router();

router.use('/auth', authUserRouter);
router.use('/auth/google', authGoogleRouter);
router.use('/api-docs', swaggerDocs());
router.use('/users', authDataUserRouter);
router.use('/users', usersResetPasswordRouter);
router.use('/users', usersUpdateRouter);

router.use('/water/all', waterDataRouter);
router.use('/water', auth, waterDataRouter);

export default router;