export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";
export type ReportTargetType = "QUESTION" | "ANSWER" | "COMMENT";
export type VoteType = "UPVOTE" | "DOWNVOTE";

export interface Author {
  id: string;
  name: string | null;
  avatarUrl?: any;
}

export interface ForumQuestion {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  viewCount: number;
  voteScore: number;
  answerCount: number;
  isLocked: boolean;
  isPinned: boolean;
  isSolved: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  author?: Author;
  _count?: {
    answers: number;
    comments: number;
  };
}

export interface ForumAnswer {
  id: string;
  questionId: string;
  authorId: string;
  content: string;
  isAccepted: boolean;
  voteScore: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  question?: {
    id: string;
    authorId: string;
    isLocked: boolean;
  };
  author?: Author;
  _count?: {
    comments: number;
  };
}

export interface ForumComment {
  id: string;
  authorId: string;
  questionId: string | null;
  answerId: string | null;
  content: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  author?: Author;
  question?: {
    id: string;
    isLocked: boolean;
  } | null;
  answer?: {
    id: string;
    question: {
      id: string;
      isLocked: boolean;
    };
  } | null;
}

export interface ForumVote {
  id: string;
  userId: string;
  voteType: VoteType;
  questionId: string | null;
  answerId: string | null;
  createdAt: string;
}

export interface ForumBookmark {
  id: string;
  userId: string;
  questionId: string;
  createdAt: string;
  
  // Relations
  question?: {
    id: string;
    title: string;
    slug: string;
    tags: string[];
    viewCount: number;
    voteScore: number;
    answerCount: number;
    isSolved: boolean;
    createdAt: string;
    deletedAt: string | null;
    author: Author;
  };
}

export interface ForumReport {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  questionId: string | null;
  answerId: string | null;
  commentId: string | null;
  reason: string;
  status: ReportStatus;
  reviewerId: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  reporter?: Author;
  reviewer?: {
    id: string;
    name: string | null;
  } | null;
  question?: {
    id: string;
    title: string;
    slug: string;
    authorId: string;
  } | null;
  answer?: {
    id: string;
    content: string;
    authorId: string;
    questionId: string;
  } | null;
  comment?: {
    id: string;
    content: string;
    authorId: string;
  } | null;
}

// REQUEST & RESPONSE PAYLOAD INTERFACES

// Questions
export interface CreateQuestionRequest {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateQuestionRequest {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface ListQuestionsParams {
  cursor?: string;
  limit?: number;
  tag?: string;
  search?: string;
  sort?: "recent" | "votes" | "unanswered";
}

export interface ListQuestionsResponseData {
  questions: ForumQuestion[];
  nextCursor?: string;
  hasMore: boolean;
}

// Answers
export interface CreateAnswerRequest {
  content: string;
}

export interface UpdateAnswerRequest {
  content: string;
}

export interface ListAnswersParams {
  page?: number;
  limit?: number;
  sort?: "votes" | "oldest" | "newest";
}

export interface ListAnswersResponseData {
  answers: ForumAnswer[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Comments
export interface CreateCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

// Bookmarks
export interface ListBookmarksParams {
  page?: number;
  limit?: number;
}

export interface ListBookmarksResponseData {
  bookmarks: ForumBookmark[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Votes
export interface CastVoteRequest {
  targetType: "QUESTION" | "ANSWER";
  targetId: string;
  voteType: VoteType;
}

export interface CastVoteResponseData {
  action: "voted" | "changed" | "removed";
  voteType: VoteType | null;
  voteScore: number;
}

export interface VoteStatusParams {
  targetType: "QUESTION" | "ANSWER";
  targetId: string;
}

export interface VoteStatusResponseData {
  hasVoted: boolean;
  voteType: VoteType | null;
}

// Reports
export interface CreateReportRequest {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
}

export interface ReviewReportRequest {
  status: "RESOLVED" | "DISMISSED";
  remarks?: string;
}

export interface ListReportsParams {
  page?: number;
  limit?: number;
  status?: ReportStatus;
}

export interface ListReportsResponseData {
  reports: ForumReport[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface GetPendingCountResponseData {
  pendingCount: number;
}
