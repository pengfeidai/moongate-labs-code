import { Action } from 'routing-controllers';

export class AuthorizationService {
  private static instance: AuthorizationService;

  public static getInstance(): AuthorizationService {
    if (!this.instance) {
      this.instance = new AuthorizationService();
    }

    return this.instance;
  }

  async authorizationChecker(
    action: Action,
    _roles: string[]
  ): Promise<boolean> {
    try {
      // TODO: Implement authorization logic
      return true;
    } catch (error) {
      return false;
    }
  }
}
