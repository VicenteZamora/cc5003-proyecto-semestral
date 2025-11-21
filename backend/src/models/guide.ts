import mongoose, { Schema } from "mongoose";

export interface Guide {
  id: string;
  tags: string;
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  game: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const guideSchema = new Schema<Guide>(
  {
    tags: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    game: { type: Schema.Types.ObjectId, ref: "Game", required: true },
  },
  {
    timestamps: true,
  }
);

export const guideModel = mongoose.model<Guide>("Guide", guideSchema);

guideSchema.set("toJSON", {
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