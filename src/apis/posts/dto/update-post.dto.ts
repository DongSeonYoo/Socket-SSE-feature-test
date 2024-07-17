import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  /**
   * 게시글 인덱스
   */
  @IsNotEmpty()
  idx: number;

  /**
   * 게시글 제목
   */
  @IsOptional()
  title?: string;

  /**
   * 게시글 내용
   */
  @IsOptional()
  content?: string;
}
