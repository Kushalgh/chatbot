import mongoose, { Document, Schema } from "mongoose";

export interface IType extends Document {
  id: string;
  type_name: string;
}

const typeSchema = new Schema<IType>({
  id: { type: String, required: true, unique: true },
  type_name: { type: String, required: true },
});

const Type = mongoose.model<IType>("Type", typeSchema);

export default Type;
