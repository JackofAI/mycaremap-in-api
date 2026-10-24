import { UserCareState } from './careMap';

export interface UserAccount {
  id: string;
  name: string;
  emailOrPhone: string;
  createdAt: string;
}

export interface AuthSession {
  user: UserAccount;
  token: string;
  careState?: UserCareState;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: AuthSession;
  error?: string;
}
