import { Schema, model, Document } from 'mongoose';
import mongoose from 'mongoose';
import { uuid } from '../utils/utils';

interface IUser extends Document {
  userId: string;
  name: string;
  points: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * user schema
 */
const UserSchema = new Schema<IUser>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    userId: {
      type: String,
      required: true,
      index: true,
      default: () => uuid()
    },
    name: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const UserEntity = model<IUser>('User', UserSchema);

export default UserEntity;
