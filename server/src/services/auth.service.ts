// import type { IUser } from "../models/User.model.js";
// import User from "../models/User.model.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// export const signUp = async (data: IUser) => {
//   const existingUser = await User.findOne({ name: data.name });
//   if (existingUser) {
//     throw new Error("User already exists");
//   }

//   const hashedPassword = await bcrypt.hash(data.password, 10);

//   const newUser = new User({
//     name: data.name,
//     password: hashedPassword,
//   });
//   const savedUser = await newUser.save();

//   console.log("User Signed Up successfully:", savedUser);

//   const token = jwt.sign(
//     {
//       id: savedUser._id,
//       name: savedUser.name,
//     },
//     process.env.JWT_SECRET!,
//     {
//       expiresIn: "1Day",
//     }
//   );

//   return token;
// };

// export const login = async (data: IUser) => {
//   const user = await User.findOne({
//     name: data.name,
//   });
//   if (!user) {
//     console.log("user doens't exists");
//     throw new Error("User doesn't exists");
//   }

//   const isMatch = await bcrypt.compare(data.password, user.password);
//   if (!isMatch) {
//     console.log("Invalid credentials");
//     throw new Error("Invalid credentials ");
//   }
//   const token = jwt.sign(
//     {
//       id: user._id,
//       name: user.name,
//     },
//     process.env.JWT_SECRET!,
//     {
//       expiresIn: "1Day",
//     }
//   );
//   return token;
// };
