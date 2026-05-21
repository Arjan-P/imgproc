import { ErrorCode } from "@imgproc/shared";
import { AppError } from "./AppError.js";

export class BadRequestError extends AppError {
  constructor(
    message = "Bad Request Error",
    code: ErrorCode = "BAD_REQUEST",
    details?: unknown,
  ) {
    super(message, 400, code, details);
  }
}
