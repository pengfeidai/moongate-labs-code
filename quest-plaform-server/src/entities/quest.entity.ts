import { Schema, model, Document } from 'mongoose';
import mongoose from 'mongoose';
import { uuid } from '../utils/utils';

interface IQuest extends Document {
  questId: string;
  title: string;
  description: string;
  maxCompletions: number; // 每个用户最多完成次数
  rewardPoints: number; // 奖励积分
  startDate: Date; // 任务开始时间
  endDate: Date; // 任务结束时间
  created_at: Date;
  updated_at: Date;
}

/**
 * quest schema
 */
const QuestSchema = new Schema<IQuest>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    questId: {
      type: String,
      required: true,
      index: true,
      default: () => uuid()
    },
    title: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: false
    },
    maxCompletions: {
      type: Number,
      default: 1,
      required: true
    },
    rewardPoints: {
      type: Number,
      default: 0,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const Quest = model<IQuest>('quest', QuestSchema);

export default Quest;
