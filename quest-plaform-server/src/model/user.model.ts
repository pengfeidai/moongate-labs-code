import { Service } from 'typedi';
import UserEntity from '../entities/user.entity';

@Service()
export class UserModel {
  constructor() {}

  async save(params: { [key: string]: any }) {
    const doc = new UserEntity(params);
    return await UserEntity.bulkSave([doc]);
  }

  async getOne(params: { [key: string]: any }) {
    return await UserEntity.findOne(params).lean().exec();
  }

  async getList(params: { [key: string]: any }, limit: number) {
    return await UserEntity.find(params).limit(limit).lean().exec();
  }

  async updateById(userId, params: any) {
    return await UserEntity.updateOne({ userId }, params).lean().exec();
  }

  async deleteMany(params: { [key: string]: any }) {
    return await UserEntity.deleteMany(params).lean().exec();
  }
}
