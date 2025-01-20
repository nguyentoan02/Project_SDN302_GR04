const { SuccessResponse } = require('../core/success');
const { createUser, getAllUsers } = require('../services/user.service');

exports.getUsers = async (req, res) => {
  const users = await getAllUsers();
  return SuccessResponse.ok(res, users, 'Users retrieved successfully');
};

exports.createUser = async (req, res) => {
  const user = await createUser(req.body);
  return SuccessResponse.created(res, user, 'User created successfully');
};
