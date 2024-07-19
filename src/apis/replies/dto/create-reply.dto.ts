import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IReply } from '../entities/reply.entity';

export class CreateReplyRequestDto implements IReply.ICreateReplyInput {
  /**
   * 댓글 인덱스
   * @example 1
   */
  @IsNotEmpty()
  @IsNumber()
  commentIdx: number;

  /**
   * 댓글 내용
   * @example "댓글 내용"
   */
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreateReplyRepsonseDto implements Pick<IReply, 'idx'> {
  /**
   * 생성된 답글 인덱스
   */
  idx: number;
}
