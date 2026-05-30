export interface DjangoSession {
  id: string;
  created_at: string;
  duration_seconds: number;
  earnings: string;
  photo_url?: string;
}
