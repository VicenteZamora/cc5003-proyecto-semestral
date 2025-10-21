import mongoose, { Schema } from "mongoose";

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  posts: mongoose.Types.ObjectId[];
  guides: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<User>({
  username: { type: String, unique: true, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v: string) {
        const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        return emailRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  passwordHash: { type: String, required: true },
  // TODO: Update ref in case the model name changes
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  guides: [{ type: Schema.Types.ObjectId, ref: "Guide" }],
});

export const UserModel = mongoose.model<User>("User", userSchema);

userSchema.set("toJSON", {
  transform: (
    _,
    obj: {
      id?: string;
      _id?: mongoose.Types.ObjectId;
      __v?: number;
      passwordHash?: string;
    },
  ) => {
    obj.id = obj._id?.toString();
    delete obj._id;
    delete obj.__v;
    delete obj.passwordHash;
  },
});
