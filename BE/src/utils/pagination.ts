import { PAGINATION } from '../config/constants';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(query: { page?: string; limit?: string }): PaginationParams {
  const page = Math.max(1, parseInt(query.page || String(PAGINATION.DEFAULT_PAGE), 10));
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit || String(PAGINATION.DEFAULT_LIMIT), 10))
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
