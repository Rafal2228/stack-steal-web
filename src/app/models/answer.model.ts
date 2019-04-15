import { User } from './user.model';

export interface Answer {
  owner?: User;
  isAccepted?: boolean;
  score?: number;
  lastActivityDate?: Date;
  creationDate?: Date;
  answerId?: number;
  questionId?: number;
  bodyMarkdown?: string;
}

export interface AnswersResponse {
  data?: Answer[];
  hasMore?: boolean;
}
