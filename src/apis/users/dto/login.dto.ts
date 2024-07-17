import { IsNotEmpty, IsString } from 'class-validator';
import { IUser } from '../entities/user.entity';

export class LoginRequestDto {
  /**
   * 유저 이메일
   * @example inko51366@naver.com
   */
  @IsNotEmpty()
  @IsString()
  email: string;

  /**
   * 유저 비밀번호
   * @example 1234Asd..
   */
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponseDto implements IUser.ILoginResponse {
  /**
   * 엑세스 토큰
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjEsIm5hbWUiOiJ0ZXN0In0.1
   */
  accessToken: string;
}
