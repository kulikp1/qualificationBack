import { Router } from 'express';
import { controllerWrapper } from '../utils/controllerWrapper.js';
import { defineWaterDataObject } from '../middlewares/waterData.js';
import { validateBody } from '../middlewares/validateBody.js';
import { validateId } from '../middlewares/validateId.js';
import {
  addWaterDataSchema,
  updateWaterDataSchema,
} from '../validation/waterDataValidation.js';
import {
  upsertWaterItemController,
  createWaterDataController,
  getWaterDataDayController,
  getWaterDataMonthController,
  deleteWaterItemByIdController,
} from '../controllers/waterDataController.js';

const router = Router();

router.post(
  '/',
  validateBody(addWaterDataSchema),
  defineWaterDataObject,
  controllerWrapper(createWaterDataController),
);

router.patch(
  '/:id',
  validateId,
  validateBody(updateWaterDataSchema),
  defineWaterDataObject,
  controllerWrapper(upsertWaterItemController),
);

router.delete(
  '/:id',
  validateId,
  controllerWrapper(deleteWaterItemByIdController),
);

router.get('/day/:date', controllerWrapper(getWaterDataDayController));
router.get('/month/:date', controllerWrapper(getWaterDataMonthController));

export default router;