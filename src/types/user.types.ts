export type UserRole = "USER" | "DOCTOR" | "BREEDER" | "BRAND" | "ADMIN";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  phone: string;
  avatarUrl: any; // JSON fields in Prisma are typed as any/JSON
  role: UserRole;
  status: UserStatus;
  lastLoginAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  name: string | null;
  email: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Request & Response payload types for send-otp / generate-otp
export interface SendOtpRequest {
  mobile: string;
}

export interface SendOtpResponseData {
  otp?: string; // returned only in development mode
}

// Request & Response payload types for verify-otp
export interface VerifyOtpRequest {
  mobile: string;
  otp: string;
}

export interface VerifyOtpResponseData {
  user: AuthUser;
  token: string;
}
