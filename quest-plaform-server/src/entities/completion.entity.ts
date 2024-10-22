import { Schema, model, Document } from 'mongoose';
import mongoose from 'mongoose';

interface ICompletion extends Document {
  userId: string;
  questId: string;
  completeTime: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * completion schema
 */
const CompletionSchema = new Schema<ICompletion>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    userId: {
      type: String,
      required: true,
      index: true
    },
    questId: {
      type: String,
      required: true
    },
    completeTime: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const CompletionEntity = model<ICompletion>('completion', CompletionSchema);

export default CompletionEntity;
