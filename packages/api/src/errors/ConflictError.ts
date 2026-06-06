import { ErrorCode } from "@imgproc/shared";
import { AppError } from "./AppError.js";

export class ConflictError extends AppError {
  constructor(
    message = "Conflict",
    code: ErrorCode = "CONFLICT_ERROR",
    details?: unknown,
  ) {
    super(message, 409, code, details);
  }
}
