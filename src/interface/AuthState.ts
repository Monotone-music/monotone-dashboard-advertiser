import * as yup from "yup";

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
  user: any;
  setIsAuthenticated: (authStatus: boolean) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setError: (errorMessage: string) => void;
  clearAuthState: () => void; // To clear the state on logout or session expiry
  logout: () => void;
}

export interface ISignInForm {
  username: string;
  password: string;
}

export interface ISignUpForm {
  username: string;
  password: string;
  displayName: string;
  email: string;
}

export const SignInSchema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();