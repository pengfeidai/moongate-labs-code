import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  QueryParam
} from 'routing-controllers';
import { Service } from 'typedi';
import { QuestService } from '../service/quest.service';
import { BaseController } from './base.controller';

/**
 * quest controller
 * @path /admin/quest
 * TODO：暂时不做权限控制了，还有参数校验后续再加
 */
@JsonController('/quest')
@Service()
export class QuestController extends BaseController {
  constructor(private questService: QuestService) {
    super();
  }

  @Post('')
  async createQuest(@Body() body: { [key: string]: any }) {
    const data = await this.questService.createQuest(body);
    return this.success(data);
  }

  @Get('/list')
  async getQuestList(
    @QueryParam('page') page: number = 1,
    @QueryParam('limit') limit: number = 10,
    @QueryParam('title') title: string = ''
  ) {
    const data = await this.questService.getQuestList(title, page, limit);
    return this.success(data);
  }

  @Get('/:questId')
  async getQuestDetail(@Param('questId') questId: string) {
    const data = await this.questService.getQuestDetail(questId);
    return this.success(data);
  }

  @Put('/:questId')
  async updateQuest(
    @Param('questId') questId: string,
    @Body() body: { [key: string]: any }
  ) {
    const data = await this.questService.updateQuest(questId, body);
    return this.success(data);
  }

  @Delete('/:questId')
  async deleteQuest(@Param('questId') questId: string) {
    const data = await this.questService.deleteQuest(questId);
    return this.success(data);
  }

  @Delete('/all')
  async deleteAllQuest() {
    const data = await this.questService.deleteAllQuest();
    return this.success(data);
  }

  @Post('/complete')
  async completeQuest(@Body() body: { [key: string]: any }) {
    const data = await this.questService.completeQuest(body);
    return this.success(data);
  }
}
