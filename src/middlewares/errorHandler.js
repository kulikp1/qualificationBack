import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      error: err.stack,
      data: err,
    });
    return;
  }
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
    error: err.stack,
  });
};