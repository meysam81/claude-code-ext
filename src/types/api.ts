/**
 * Claude API type definitions
 */

export interface Organization {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface SessionSource {
  url: string;
  type: string;
  branch?: string;
}

export interface SessionContext {
  sources?: SessionSource[];
}

export interface Session {
  id: string;
  uuid: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  session_context?: SessionContext;
}

export interface SessionsResponse {
  data: Session[];
  has_more: boolean;
}

export interface SearchResult {
  session: Session;
  repoName: string | null;
  matchType: "title" | "repo" | "both";
}
