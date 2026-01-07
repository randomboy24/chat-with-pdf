import User, { type IUser } from "../models/User.model.js";

export const createUser = async (data: IUser) => {
  const user = new User(data);
  return await user.save();
};

export const getUsers = async () => {
  return await User.find();
};
