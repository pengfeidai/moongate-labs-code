import { Service } from 'typedi';
import { QuestModel } from '../model/quest.model';
import { logger } from '../utils/logger';
import { CompletionModel } from '../model/completion.model';
import { UserModel } from '../model/user.model';
import { LockManager } from './lock.service';

@Service()
export class QuestService {
  constructor(
    private questModel: QuestModel,
    private userModel: UserModel,
    private completionModel: CompletionModel
  ) {}
  private lockManager: LockManager = new LockManager();

  async createQuest(params: { [key: string]: any }) {
    try {
      return await this.questModel.save(params);
    } catch (err) {
      return params;
    }
  }

  async getQuestList(title: string, page: number, limit: number) {
    const now = new Date();
    const filter = { startDate: { $lte: now }, endDate: { $gte: now } };
    if (title) {
      filter['title'] = new RegExp(title, 'i');
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [list, count] = await Promise.all([
      this.questModel.getList(filter, skip, limit),
      this.questModel.count(filter)
    ]);
    return { list, count };
  }

  async getQuestDetail(questId: string) {
    return await this.questModel.getOne({ questId });
  }

  async updateQuest(questId: string, params: { [key: string]: any }) {
    return await this.questModel.updateByQuestId(questId, params);
  }

  async deleteQuest(questId: string) {
    return await this.questModel.deleteMany({ questId });
  }

  async deleteAllQuest() {
    return await this.questModel.deleteMany({});
  }

  /**
   * TODO:
   * 1. 暂时没做鉴权，所以userId 直接从参数中取
   * 2. 这里需要考虑事务，但是mongoose 事务只能在replica set 中使用，所以这里暂时不支持
   * 3. 因为是一个简单服务，所以这里简单实现一个内存锁，但是这样会导致性能问题和多节点不支持，线上要使用redis分布式锁
   * @param params
   */
  async completeQuest(params: { [key: string]: string }) {
    const { questId, userId } = params;
    const expiry = 5000;

    try {
      return await this.lockManager.acquireLock(
        userId,
        async () => {
          const quest = await this.questModel.getOne({ questId });
          if (!quest) {
            throw new Error('Quest not found');
          }

          const completionsCount = await this.completionModel.count({
            userId,
            questId
          });

          if (completionsCount >= quest.maxCompletions) {
            throw new Error('Completion limit exceeded');
          }

          await Promise.all([
            this.completionModel.save({
              userId,
              questId,
              completeTime: new Date()
            }),
            this.userModel.updateById(userId, {
              $inc: { points: quest.rewardPoints }
            })
          ]);
        },
        expiry
      );
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }
}
