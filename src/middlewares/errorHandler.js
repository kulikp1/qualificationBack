import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message, // 🟢 Важливо: передаємо текст помилки
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
