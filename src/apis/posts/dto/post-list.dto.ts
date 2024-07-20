import { IPost } from '../entities/post.entity';

export class PostListResponseDto implements IPost.IPostListOutput {
  /**
   * 게시글 인덱스
   * @example 1
   */
  idx: number;

  /**
   * 게시글 제목
   * @example 게시글 제목
   */
  title: string;

  /**
   * 게시글 작성자 인덱스
   * @example 1
   */
  authorIdx: number;

  /**
   * 게시글 작성자 이름
   * @example 작성자
   */
  authorName: string;

  /**
   * 게시글 작성일
   * @example 2021-01-01T00:00:00
   */
  createdAt: Date;
}
