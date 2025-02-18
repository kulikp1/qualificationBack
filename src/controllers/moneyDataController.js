
import createHttpError from 'http-errors';
import {
  getAuthUserByEmail,
  updateUsersById,
} from '../services/authUserService.js';

export const usersUpdateController = async (req, res, next) => {
  const userId = req.authUser._id;
  const { email } = req.body;

  /* если с front-end приходит email
  мы ищем его в db, если его нет, значит пользователь меняет его на новый,
  ? если он есть в db, проверяем кому он принадлежит:
  * если нашему пользователю, значит он пришел автоматом со вмеми данными, игнорируем и обновляем все
  ! если он принадледжит другому пользователю, сообщаем что замена не возможна */

  if (email) {
    const userEmail = await getAuthUserByEmail(email);

    if (userEmail !== null && !userId.equals(userEmail._id)) {
      throw createHttpError(
        409,
        'This email is already in use and cannot be changed',
      );
    }
  }

  const user = await updateUsersById(userId, req.body);

  if (!user) throw createHttpError(404, 'User not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully updated user data!',
    data: user,
  });
};
