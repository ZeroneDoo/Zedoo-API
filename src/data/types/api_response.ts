export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: {
      code: string;
      details?: any;
    };
    meta?: {
      next_page: number,
      next_url: string,
      prev_page?: number
      prev_url?: string,
      total_data?: number
  };
}