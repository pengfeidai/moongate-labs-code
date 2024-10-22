import { Service } from 'typedi';
import CompletionEntity from '../entities/completion.entity';

@Service()
export class CompletionModel {
  constructor() {}

  async save(params: { [key: string]: any }) {
    const doc = new CompletionEntity(params);
    return await CompletionEntity.bulkSave([doc]);
  }

  async getOne(params: { [key: string]: any }) {
    return await CompletionEntity.findOne(params).lean().exec();
  }

  async getList(params: { [key: string]: any }, skip: number, limit: number) {
    return await CompletionEntity.find(params)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async updateById(_id, params: any) {
    return await CompletionEntity.updateOne({ _id }, params).lean().exec();
  }

  async deleteMany(params: { [key: string]: any }) {
    return await CompletionEntity.deleteMany(params).lean().exec();
  }

  async count(params: { [key: string]: any }) {
    return await CompletionEntity.countDocuments(params).lean().exec();
  }
}
