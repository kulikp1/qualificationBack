import { format } from 'date-fns';

export async function defineMoneyDataObject(req, res, next) {
  const authUser = req.authUser;
  const dateTimeStamp = Date.now();
  const date =
    req.body.date != undefined
      ? req.body.date
      : format(dateTimeStamp, 'yyyy-MM-dd');
  const time =
    req.body.time != undefined ? req.body.time : format(dateTimeStamp, 'HH:mm');

  let moneyData = {
    userId: authUser._id,
    ...req.body,
    date,
    time,
  };

  req.moneyData = moneyData;
  next();
}