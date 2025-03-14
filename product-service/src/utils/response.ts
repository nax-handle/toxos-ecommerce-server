export interface Response<T> {
  data: T;
  message: string;
}

export interface PaginatedResponse<T> extends Response<T> {
  total: number;
  page: number;
  limit: number;
}

export const response = <T>(data: T, message: string): Response<T> => {
  return {
    data,
    message,
  };
};

export const responseWithPagination = <T>(
  data: T,
  message: string,
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> => {
  return {
    data,
    message,
    total,
    page,
    limit,
  };
};
