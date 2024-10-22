import { Service } from 'typedi';
import { UserModel } from '../model/user.model';
import { CompletionModel } from '../model/completion.model';

@Service()
export class UserService {
  constructor(
    private userModel: UserModel,
    private completionModel: CompletionModel
  ) {}

  async addUser(params: { [key: string]: any }) {
    const user = await this.userModel.getOne({ name: params.name });
    if (user) {
      throw new Error('User already exists');
    }
    return await this.userModel.save({ ...params });
  }

  async getUser(userId: string) {
    return await this.userModel.getOne({ userId });
  }

  async getUserList() {
    return await this.userModel.getList({}, 10);
  }

  async getUserCompletions(userId: string, page: number, limit: number) {
    const skip = (Number(page) - 1) * Number(limit);
    const [list, count] = await Promise.all([
      this.completionModel.getList({ userId }, skip, limit),
      this.completionModel.count({ userId })
    ]);
    return { list, count };
  }
}
