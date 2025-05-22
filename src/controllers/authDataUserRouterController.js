export const authDataUserRouterController = (req, res, next) => {
  const user = req.authUser;

  

  res.status(200).json({
    status: 200,
    message: 'User data retrieved successfully',
    data: user,
  });
};