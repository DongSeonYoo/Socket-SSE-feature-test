import { IPost } from '../entities/post.entity';

export class DetailPostResponseDto implements IPost.IDetialPostOutput {
  /**
   * 게시글 인덱스
   */
  idx: number;

  /**
   * 작성자 인덱스
   */
  authorIdx: number;

  /**
   * 게시글 제목
   */
  title: string;

  /**
   * 게시글 내용
   */
  content: string;

  /**
   * 게시글 생성일
   */
  createdAt: Date;
}
