import { Service } from 'typedi';
import { AirdropModel } from '../model/airdrop.model';
import { AIRDROP_STATUS } from '../constants/constant';
import { keccak256 } from 'ethers';
import { logger } from '../utils/logger';

@Service()
export class JobService {
  constructor(private airdropModel: AirdropModel) {}
  private limit = 20; // handle 20 records per time
  private maxRetryTimes = 10; // max retry 10 times

  async getAirDropFailedList() {
    const airdrops = await this.airdropModel.getList(
      {
        status: AIRDROP_STATUS.FAILED,
        retryTimes: { $lte: this.maxRetryTimes }
      },
      this.limit
    );
    return airdrops;
  }

  async retryAirdrop() {
    // TODO: 使用redis锁来防止重复执行
    // redisService.set(key, value, 'EX', expireTime, 'NX')
    const data = { pending: 0, failed: 0 };
    const failedAirdrops = await this.getAirDropFailedList();
    if (failedAirdrops.length === 0) return data;

    for (const airdrop of failedAirdrops) {
      const { hash, status } = await this.sendAirdrop(airdrop);
      if (status === AIRDROP_STATUS.PENDING) {
        data.pending++;
      } else {
        data.failed++;
      }
      await this.airdropModel.updateById(airdrop._id, {
        hash,
        status,
        retryTimes: airdrop.retryTimes + 1
      });
    }
    return data;
  }

  /**
   * mock 100笔交易数据进行空投
   */
  async mockAirdrop() {
    const data = {
      pending: 0,
      failed: 0
    };
    for (let i = 0; i < 100; i++) {
      const airdrop = {
        airdropId: `airdrop_${i}`,
        from: `from_${i}`,
        to: `to_${i}`,
        tokenId: `tokenId_${i}`,
        retryTimes: 0
      };
      const { hash, status } = await this.sendAirdrop(airdrop);
      if (status === AIRDROP_STATUS.PENDING) {
        data.pending++;
      } else {
        data.failed++;
      }
      await this.airdropModel.save({ ...airdrop, hash, status });
    }
    return data;
  }

  /**
   * mock发送空投
   * TODO: 实际场景需要使用etherjs或web3js发送交易
   */
  async sendAirdrop(airdrop) {
    // 根据参数from to tokenId等生成调用signTransaction生成data，简单先用字符串拼接
    const data = 'transactionData' + airdrop.airdropId;
    const hash = this.generatePreHash(data);
    const status = await this.sendTransaction(data);
    // 这里就不要检查receipt了，因为等交易稳定比较慢，性能非常差，先入库，然后通过另一个任务来检查receipt
    return { hash, status };
  }

  private generatePreHash(data: string): string {
    try {
      // 这里因为mock data数据格式不对，肯定会报错
      return keccak256(data);
    } catch (err) {
      return data;
    }
  }

  /**
   * 模拟发送交易，mock 80%成功，20%报错
   * @param data
   */
  async sendTransaction(data: string) {
    try {
      const random = Math.random();
      if (random < 0.8) {
        return AIRDROP_STATUS.PENDING;
      } else {
        throw new Error('Mock sendTransaction error');
      }
    } catch (err) {
      logger.error('Mock sendTransaction error:', err);
      return AIRDROP_STATUS.FAILED;
    }
  }

  async clearAirdrop() {
    return await this.airdropModel.deleteMany({});
  }

  /**
   * 任务检查空投交易receipt
   */
  async checkAirdropReceipt() {
    const data = { success: 0, failed: 0 };
    const airdrops = await this.airdropModel.getList(
      { status: AIRDROP_STATUS.PENDING },
      100
    );
    for (const airdrop of airdrops) {
      // TODO: 通过hash查询receipt const status = await this.getTransactionReceipt(airdrop.hash);
      // 正常receipt里面会有status字段，如果status为0表示失败，为1表示成功
      const status =
        Math.random() < 0.95 ? AIRDROP_STATUS.SUCCESS : AIRDROP_STATUS.FAILED;

      if (status === AIRDROP_STATUS.SUCCESS) {
        data.success++;
      } else {
        data.failed++;
      }
      await this.airdropModel.updateById(airdrop._id, { status });
    }
    return data;
  }
}
