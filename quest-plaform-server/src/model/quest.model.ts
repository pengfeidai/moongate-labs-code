import { Service } from 'typedi';
import QuestEntity from '../entities/quest.entity';

@Service()
export class QuestModel {
  constructor() {}

  async save(params: { [key: string]: any }) {
    const doc = new QuestEntity(params);
    return await QuestEntity.bulkSave([doc]);
  }

  async getOne(params: { [key: string]: any }) {
    return await QuestEntity.findOne(params).lean().exec();
  }

  async getList(params: { [key: string]: any }, skip: number, limit: number) {
    return await QuestEntity.find(params)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async count(params: { [key: string]: any }) {
    return await QuestEntity.countDocuments(params).lean().exec();
  }

  async updateByQuestId(questId: string, params: any) {
    return await QuestEntity.updateOne({ questId }, params).lean().exec();
  }

  async deleteMany(params: { [key: string]: any }) {
    return await QuestEntity.deleteMany(params).lean().exec();
  }
}
