export enum AccessLevel {
  private = 0,
  public = 1
};

export enum MemberStatus {
  invited = 'invited',
  accepted = 'accepted',
  rejected = 'rejected' 
};

export enum TopicStatuses {
  not_checked = 'not_checked',
  accepted = 'accepted',
  archive = 'archive',
  blocked = 'blocked',
  temporary_blocked = 'temporary_blocked',
};

export enum CommentStatus {
  new = 'new',
  accepted = 'accepted',
  blocked = 'blocked',
};
