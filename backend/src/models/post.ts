import mongoose, { Schema } from "mongoose";

export interface Post {
  id: string;
  content: string;
  author: mongoose.Types.ObjectId;
  guide: mongoose.Types.ObjectId;
}

const postSchema = new Schema<Post>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    guide: { type: Schema.Types.ObjectId, ref: "Guide", required: true },
  },
  {
    timestamps: true,
  }
);

postSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: {
      id?: string;
      _id?: mongoose.Types.ObjectId;
      __v?: number;
    },
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const postModel = mongoose.model<Post>("Post", postSchema);