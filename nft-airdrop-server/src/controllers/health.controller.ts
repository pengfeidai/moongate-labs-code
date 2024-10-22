import { JsonController, Get } from 'routing-controllers';
import { BaseController } from './base.controller';
import { Service } from 'typedi';

@JsonController('/health')
@Service()
export class HealthController extends BaseController {
  constructor() {
    super();
  }

  @Get('/')
  public async getHealth() {
    return this.success('Hello World!');
  }
}
