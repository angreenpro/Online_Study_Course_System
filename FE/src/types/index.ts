// ============================================
// Shared TypeScript Types — E-Learning System
// ============================================

// --- User & Auth ---

export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// --- API Response ---

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Navigation ---

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: Role[]; // If empty, visible to all authenticated users
  badge?: number;
}

export interface SidebarSection {
  title?: string;
  items: NavItem[];
}
