import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IUser } from '../entities/user.entity';

export class CreateUserDto implements IUser.ICreateUserRequest {
  /**
   * 유저 이메일
   */
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  /**
   * 유저 이름
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 유저 비밀번호
   */
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class CreateUserResponseDto implements Pick<IUser, 'idx'> {
  /**
   * 생성된 유저 idx
   */
  idx: IUser['idx'];
}
