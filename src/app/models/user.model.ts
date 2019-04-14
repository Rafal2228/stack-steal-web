export enum UserType {
  unregistered = 'unregistered',
  registered = 'registered',
  moderator = 'moderator',
  teamAdmin = 'teamAdmin',
  doesNotExist = 'doesNotExist'
}

export interface User {
  reputation?: number;
  userId: number;
  userType?: UserType;
  profileImage?: string;
  displayName?: string;
  link?: string;
}
