import { Schema, model, Document } from 'mongoose';
import mongoose from 'mongoose';
import { AIRDROP_STATUS } from '../constants/constant';

interface IAirdrop extends Document {
  airdropId: string;
  from: string;
  to: string;
  tokenId: string;
  hash?: string;
  status: AIRDROP_STATUS;
  retryTimes: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * NFT Airdrop schema
 */
const AirdropSchema = new Schema<IAirdrop>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    airdropId: {
      type: String,
      required: true,
      index: true
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true,
      index: true
    },
    tokenId: {
      type: String,
      required: true
    },
    hash: {
      type: String,
      required: false
    },
    status: {
      type: Number,
      required: true,
      enum: AIRDROP_STATUS
    },
    retryTimes: {
      type: Number,
      required: true,
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

const Airdrop = model<IAirdrop>('Airdrop', AirdropSchema);

export default Airdrop;
