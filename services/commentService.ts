// services/commentService.ts
import { api } from "@/lib/api";

export interface Comment {
  id: string;
  session: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
  text: string;
  created_at: string;
}

export const commentService = {
  fetchComments: async (sessionId: string): Promise<Comment[]> => {
    const res = await api.get<{ results: Comment[] } | Comment[]>(`/comments/`, {
      params: { session: sessionId },
    }) as any;
    return Array.isArray(res) ? res : res.results || [];
  },
  postComment: async (sessionId: string, text: string): Promise<Comment> => {
    return api.post<Comment>(`/comments/`, {
      session: sessionId,
      text: text,
    });
  },
};
