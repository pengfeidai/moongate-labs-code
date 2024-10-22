export interface ISuccessResponse<TData> {
  code: number;
  data: TData;
  message: string;
}

export abstract class BaseController {
  protected success<TData>(data: TData): ISuccessResponse<TData> {
    return {
      code: 0,
      data,
      message: 'success'
    };
  }
}
