import { IUser } from 'src/apis/users/entities/user.entity';

export namespace IAuth {
  export interface IJwtPayload extends Pick<IUser, 'idx' | 'name'> {}
}
