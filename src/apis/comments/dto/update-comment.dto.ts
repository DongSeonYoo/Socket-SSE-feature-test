import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(
  OmitType(CreateCommentDto, ['postIdx']),
) {
  /**
   * 댓글 인덱스
   */
  idx: number;
}
