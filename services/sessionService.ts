import { api } from "@/lib/api";
import { BathroomSession } from "@/types/api";

export const sessionService = {
  getUserSessions: (page = 1) =>
    api.get<{ results: BathroomSession[] }>(`/sessions/?page=${page}`),
};
