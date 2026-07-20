/**
 * Custom HTTP Exception class for structured error responses.
 */
export class HttpException extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;

  constructor(statusCode: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'HttpException';

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, HttpException.prototype);
  }
}
