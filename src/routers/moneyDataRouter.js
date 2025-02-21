import { Router } from 'express';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import { defineMoneyDataObject } from '../middlewares/MoneyData.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateId } from '../middlewares/validateId.js';
import {
  addMoneyDataSchema,
  updateMoneyDataSchema,
} from '../validation/MoneyDataValidation.js';
import {
  upsertMoneyItemController,
  createMoneyDataController,
  getMoneyDataDayController,
  getMoneyDataMonthController,
  deleteMoneyItemByIdController,
} from '../controllers/moneyDataController.js';

const router = Router();

router.post(
  '/',
  validateBody(addMoneyDataSchema),
  defineMoneyDataObject,
  controllerWrapper(createMoneyDataController),
);

router.patch(
  '/:id',
  validateId,
  validateBody(updateMoneyDataSchema),
  defineMoneyDataObject,
  controllerWrapper(upsertMoneyItemController),
);

router.delete(
  '/:id',
  validateId,
  controllerWrapper(deleteMoneyItemByIdController),
);

router.get('/day/:date', controllerWrapper(getMoneyDataDayController));
router.get('/month/:date', controllerWrapper(getMoneyDataMonthController));

export default router;