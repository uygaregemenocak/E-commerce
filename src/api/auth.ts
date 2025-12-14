import api, { setAccessToken, ApiResponse } from './client';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  memberId?: string;
  membershipLevel?: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export const authApi = {
  async register(data: { email: string; password: string; name: string; phone?: string }): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    if (response.data.data) {
      setAccessToken(response.data.data.accessToken);
    }
    return response.data.data!;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    if (response.data.data) {
      setAccessToken(response.data.data.accessToken);
    }
    return response.data.data!;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    setAccessToken(null);
  },

  async refresh(): Promise<{ accessToken: string }> {
    const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
    if (response.data.data) {
      setAccessToken(response.data.data.accessToken);
    }
    return response.data.data!;
  },
};

