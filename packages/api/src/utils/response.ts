import type {
  ErrorCode,
  ErrorResponse,
  SuccessResponse,
} from "@imgproc/shared";

export function ok<T>(data: T, message?: string): SuccessResponse<T> {
  return {
    success: true as const,
    data,
    meta: message ? { message } : undefined,
  };
}

export function fail(
  code: ErrorCode,
  message: string,
  details?: unknown,
): ErrorResponse {
  return {
    success: false as const,
    error: {
      code,
      message,
      details,
    },
  };
}
