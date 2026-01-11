import { Schema, model } from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  image_url: string | null;
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    email : { type: String,required: true, unique: true, index: true },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    username: { type: String, default: null },
    image_url: { type: String, default: null },
    
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);

export default User;
