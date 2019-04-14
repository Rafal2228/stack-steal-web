import { AnwsersResponse } from './answer.model';
import { User } from './user.model';

export interface GetQuestionsResponse {
  data?: Question[];
  hasMore?: boolean;
}

export interface Question {
  tags?: string[];
  owner?: User;
  isAnswered?: boolean;
  viewCount?: number;
  answerCount?: number;
  score?: number;
  lastActivityDate?: Date;
  creationDate?: Date;
  lastEditDate?: Date;
  questionId: number;
  link?: string;
  title?: string;
  answers?: AnwsersResponse;
}
