import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  BadRequestError
} from 'routing-controllers';
import { Service } from 'typedi';
import { JobService } from '../service/job.service';
import { BaseController } from './base.controller';

@JsonController('/job')
@Service()
export class JobController extends BaseController {
  constructor(private jobService: JobService) {
    super();
  }

  @Get('/airdrop/failed/list')
  async getAirDropFailedList() {
    const data = await this.jobService.getAirDropFailedList();
    return this.success(data);
  }

  @Get('/airdrop/mock')
  async mockAirdrop() {
    const data = await this.jobService.mockAirdrop();
    return this.success(data);
  }

  @Delete('/airdrop')
  async clearAirdrop() {
    const data = await this.jobService.clearAirdrop();
    return this.success(data);
  }

  /**
   * 每1分钟来重试一下
   * @returns
   */
  @Get('/airdrop/retry')
  async retryAirdrop() {
    const data = await this.jobService.retryAirdrop();
    return this.success(data);
  }

  /**
   * 检查交易receipt（定时几分钟来检查）
   * @returns
   */
  @Get('/airdrop/check')
  async checkAirdropReceipt() {
    const data = await this.jobService.checkAirdropReceipt();
    return this.success(data);
  }
}
