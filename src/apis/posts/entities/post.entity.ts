import { IUser } from 'src/apis/users/entities/user.entity';
import { BaseTableOption } from 'src/utils/base-table.util';

export interface IPost extends BaseTableOption {
  idx: number;
  authorIdx: IUser['idx'];
  title: string;
  content: string;
}

export namespace IPost {
  export interface ICreatePostInput extends Pick<IPost, 'title' | 'content'> {}

  export interface IDetialPostOutput
    extends Pick<
      IPost,
      'idx' | 'authorIdx' | 'title' | 'content' | 'createdAt'
    > {}
}
