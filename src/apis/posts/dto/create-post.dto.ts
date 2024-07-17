import { IsNotEmpty, IsString } from 'class-validator';
import { IPost } from '../entities/post.entity';

export class CreatePostDto implements IPost.ICreatePostInput {
  /**
   * 게시글 제목
   * @example '게시글 제목'
   */
  @IsNotEmpty()
  @IsString()
  title: string;

  /**
   * 게시글 내용
   * @example '게시글 내용'
   */
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreatePostResponseDto implements Pick<IPost, 'idx'> {
  /**
   * 생성된 게시글의 idx
   */
  idx: number;
}
