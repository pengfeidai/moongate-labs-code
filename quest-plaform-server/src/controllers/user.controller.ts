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
import { UserService } from '../service/user.service';
import { BaseController } from './base.controller';

/**
 * quest controller
 * @path /user
 * TODO：暂时不做用户注册，直接手动添加用户
 */
@JsonController('/user')
@Service()
export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  @Post('')
  async addUser(@Body() body: { [key: string]: any }) {
    const data = await this.userService.addUser(body);
    return this.success(data);
  }

  @Get('/info/:userId')
  async getUser(@Param('userId') userId: string) {
    const data = await this.userService.getUser(userId);
    return this.success(data);
  }

  //
  @Get('/list')
  async getUserList() {
    const data = await this.userService.getUserList();
    return this.success(data);
  }

  @Get('/completions')
  async getUserCompletions(
    @QueryParam('userId') userId: string,
    @QueryParam('page') page: number = 1,
    @QueryParam('limit') limit: number = 10
  ) {
    const data = await this.userService.getUserCompletions(userId, page, limit);
    return this.success(data);
  }
}
