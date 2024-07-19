import { IComment } from 'src/apis/comments/entities/comment.entity';

export class CommentCreateEvent {
  constructor(readonly eventInfo: IComment.IEvent.OnCreate) {}
}

export class CommentUpdateEvent {
  constructor(readonly eventInfo: IComment.IEvent.OnUpdate) {}
}
