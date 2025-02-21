import { MoneyDataCollection } from '../db/models/moneyDataModel.js';
import {
  getMonthDates,
  getFormattedDate,
  getAllDaysInMonth,
} from '../utils/dateHelper.js';

export const addMoneyDataService = async (data) => {
  const moneyItem = await MoneyDataCollection.create(data);
  return moneyItem;
};

export const updateMoneyItemService = async (
  id,
  userId,
  payload,
  options = {},
) => {
  const rawResult = await MoneyDataCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!rawResult || !rawResult.value) return null;

  return {
    moneyItem: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteMoneyItemService = async (userId, id) => {
  const moneyItem = await MoneyDataCollection.findOneAndDelete({
    _id: id,
    userId,
  });
  return moneyItem;
};

export const getMoneyDataDayService = async (userId, date) => {
  date = getFormattedDate(date);
  const result = await MoneyDataCollection.find({ userId, date });
  const data = result.map((item) => ({
    id: item._id,
    time: item.time,
    value: item.value,
  }));
  const totalValue = result.reduce((acc, item) => acc + item.value, 0);
  return { data, totalValue };
};

export const getMoneyDataMonthService = async (userId, date) => {
  const monthDates = getMonthDates(date);
  const minDate = monthDates.som;
  const maxDate = monthDates.eom;

  const result = await MoneyDataCollection.aggregate([
    {
      $match: {
        userId: userId,
      },
    },
    {
      $match: {
        date: {
          $gte: minDate,
          $lt: maxDate,
        },
      },
    },
    {
      $group: {
        _id: {
          userId: '$userId',
          date: '$date',
        },
        value: { $sum: '$value' },
      },
    },
    {
      $sort: { '_id.userId': 1, '_id.date': 1 },
    },
  ]);
  const moneyData = result.map((item) => ({
    date: item._id.date,
    value: item.value,
  }));

  const monthDays = getAllDaysInMonth(date);
  const moneyDataMap = new Map(moneyData.map((item) => [item.date, item]));
  const moneyDataMonth = monthDays.map((day) => {
    if (moneyDataMap.has(day)) {
      return moneyDataMap.get(day);
    }
    return {
      date: day,
      value: 0,
    };
  });

  return moneyDataMonth;
};