import { IPost } from 'src/apis/posts/entities/post.entity';
import { IUser } from 'src/apis/users/entities/user.entity';

export class CommentListResponseDto implements IPost.ICommentListOutput {
  /**
   * 댓글 idx
   * @example 1
   */
  idx: number;

  /**
   * 댓글 내용
   * @example "댓글 내용"
   */
  content: string;

  /**
   * 댓글 작성자 idx
   * @example 1
   */
  authorIdx: IUser['idx'];

  /**
   * 댓글 작성자 이름
   * @example "작성자 이름"
   */
  authorName: IUser['name'];

  /**
   * 댓글 생성일
   * @example "2021-01-01T00:00:00.000Z"
   */
  createdAt: Date;

  /**
   * 댓글 수정일
   * @example "2021-01-01T00:00:00.000
   **/
  updatedAt: Date;
}
