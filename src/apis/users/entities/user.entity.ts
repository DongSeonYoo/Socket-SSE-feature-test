import { BaseTableOption } from 'src/utils/base-table.util';

export interface IUser extends BaseTableOption {
  idx: number;
  email: string;
  password: string;
  name: string;
}

export namespace IUser {
  export interface ICreateUserRequest
    extends Pick<IUser, 'email' | 'name' | 'password'> {}
}
