import { Service } from 'typedi';
import Airdrop from '../entities/airdrop.entity';

@Service()
export class AirdropModel {
  constructor() {}

  async save(params: { [key: string]: any }) {
    return await Airdrop.create(params);
  }

  async getOne(params: { [key: string]: any }) {
    return await Airdrop.findOne(params).lean().exec();
  }

  async getList(params: { [key: string]: any }, limit: number) {
    return await Airdrop.find(params).limit(limit).lean().exec();
  }

  async updateById(_id, params: any) {
    return await Airdrop.updateOne({ _id }, params).lean().exec();
  }

  async deleteMany(params: { [key: string]: any }) {
    return await Airdrop.deleteMany(params).lean().exec();
  }
}
