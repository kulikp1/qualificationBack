import createHttpError from 'http-errors';
import {
  addMoneyDataService,
  updateMoneyItemService,
  deleteMoneyItemService,
  getMoneyDataDayService,
  getMoneyDataMonthService,
} from '../services/moneyDataService.js';

export const createMoneyDataController = async (req, res) => {
  const data = await addMoneyDataService(req.moneyData);
  res.status(201).json({
    status: 201,
    message: `Successfully created a moneyItem!`,
    data,
  });
};


export const upsertMoneyItemController = async (req, res) => {
  const { id } = req.params;
  const userId = req.authUser._id;
  const result = await updateMoneyItemService(id, userId, req.body, {
    upsert: true,
  });

  if (!result) {
    throw createHttpError(404, 'MoneyItem not found');
  }

  const status = result.isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: `Successfully upserted a moneyItem!`,
    data: result.moneyItem,
  });
};

export const deleteMoneyItemByIdController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.authUser._id;
  const moneyItem = await deleteMoneyItemService(userId, id);

  if (!moneyItem) {
    throw createHttpError(404, `MoneyItem by id:[${id}] not exists`);
  }

  res.status(204).send();
};

export const getMoneyDataDayController = async (req, res, next) => {
  let { date } = req.params;
  const user = req.authUser;
  const userId = user._id;

  const day = await getMoneyDataDayService(userId, date);

  res.send({
    date,
    userId,
    dailyNorm: user.dailyNorm,
    totalValue: day.totalValue,
    data: day.data,
  });
};

export const getMoneyDataMonthController = async (req, res, next) => {
  let { date } = req.params;
  const user = req.authUser;
  const userId = user._id;

  const moneyData = await getMoneyDataMonthService(userId, date);

  res.send({
    userId,
    dailyNorm: user.dailyNorm,
    data: moneyData,
  });
};