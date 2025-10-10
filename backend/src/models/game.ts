import mongoose, { Schema } from "mongoose";

export interface Game {
  id: string;
  name: string;
  genre: string;
  platform: string;
  description: string;
  guides: mongoose.Types.ObjectId[];
  image: string;
}

const gameSchema = new Schema<Game>({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  platform: { type: String, required: true },
  description: { type: String, required: true },
  guides: [{ type: Schema.Types.ObjectId, ref: "Guide" }],
  image: { type: String, required: true },
});

export const gameModel = mongoose.model<Game>("Game", gameSchema);

gameSchema.set("toJSON", {
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
