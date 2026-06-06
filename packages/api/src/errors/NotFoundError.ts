import { ErrorCode } from "@imgproc/shared";
import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(
    message = "Resource not found",
    code: ErrorCode = "NOT_FOUND_ERROR",
    details?: unknown,
  ) {
    super(message, 404, code, details);
  }
}
