export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  code: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
