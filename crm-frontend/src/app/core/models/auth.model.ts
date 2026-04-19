export interface AuthResponse {
  token: string;
  id: string;
  email: string;
  fullName: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
}
