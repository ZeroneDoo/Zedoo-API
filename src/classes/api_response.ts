import type { ApiResponse } from "../data/types/api_response.js";

export class ResponseHandler {
    static success<T>(
      data: T,
      meta?: ApiResponse['meta'],
      message?: string,
    ): ApiResponse<T> {
      return {
        success: true,
        data,
        message,
        meta
      };
    }
  
    static error(
      message: string,
      code: string = 'Internal Server Error',
      details?: any
    ): ApiResponse {
      return {
        success: false,
        error: {
          code,
          details
        },
        message
      };
    }
  
    // Untuk response dengan pagination
    static paginate<T>(
      data: T[],
      page: number,
      limit: number,
      totalData: number,
      message: string = 'Success'
    ): ApiResponse<T[]> {
      return {
        success: true,
        message,
        data,
      };
    }
}
  