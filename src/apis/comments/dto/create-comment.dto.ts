import { IsNotEmpty, IsString } from 'class-validator';
import { IComment } from '../entities/comment.entity';

export class CreateCommentDto implements IComment.ICreateCommentInput {
  /**
   * 댓글 내용
   */
  @IsNotEmpty()
  @IsString()
  content: string;

  /**
   * 게시글 인덱스
   */
  @IsNotEmpty()
  postIdx: number;
}

export class CreateCommentResponseDto implements Pick<IComment, 'idx'> {
  /**
   * 생성된 댓글 인덱스
   */
  idx: number;
}
