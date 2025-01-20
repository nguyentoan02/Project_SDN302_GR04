const UserModel = require('../models/user');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      throw new NotFoundError('Users');
    }

    return SuccessResponse.ok(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw new ValidationError('Email and password are required');
    }

    const user = new User(req.body);
    const savedUser = await user.save();

    if (!savedUser) {
      throw new DatabaseError('Failed to create user');
    }

    return SuccessResponse.created(res, savedUser, 'User created successfully');
  } catch (error) {
    next(error);
  }
};

// Exporting service functions
module.exports = {
  getAllUsers,
  createUser
};
