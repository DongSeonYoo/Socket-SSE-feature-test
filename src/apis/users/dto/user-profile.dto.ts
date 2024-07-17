import { IUser } from '../entities/user.entity';

export class UserProfileResponseDto implements IUser.IUserProfileResponse {
  /**
   * 회원 인덱스
   * @example 1
   */
  idx: number;

  /**
   * 회원 이메일
   * @example test@naver.com
   */
  email: string;

  /**
   * 회원 이름
   * @example 홍길동
   */
  name: string;

  /**
   * 회원 생성일
   * @example 2021-08-01T00:00:00.000Z
   */
  createdAt: Date;

  /**
   * 회원 수정일
   * @example 2021-08-01T00:00:00.000Z
   */
  updatedAt: Date;
}
