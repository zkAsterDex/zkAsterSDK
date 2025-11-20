import { ApiError } from '../types';

/**
 * Custom error class for API errors
 */
export class ZkAsterError extends Error {
  public readonly code?: number;
  public readonly description?: string;
  public readonly minAmount?: number;
  public readonly maxAmount?: number | null;

  constructor(message: string, apiError?: ApiError) {
    super(message);
    this.name = 'ZkAsterError';
    this.code = apiError?.code;
    this.description = apiError?.description;
    this.minAmount = apiError?.minAmount;
    this.maxAmount = apiError?.maxAmount;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZkAsterError);
    }
  }
}

/**
 * Parse error from API response
 */
export function parseError(response: any, status: number): ZkAsterError {
  if (typeof response === 'object' && response !== null) {
    const apiError = response as ApiError;
    
    // Handle structured error with limits
    if (apiError.minAmount !== undefined || apiError.maxAmount !== null) {
      const message = apiError.description || apiError.error || 'Amount out of range';
      return new ZkAsterError(message, apiError);
    }
    
    // Handle standard API errors
    const message = apiError.description || apiError.error || `API error (${status})`;
    return new ZkAsterError(message, apiError);
  }
  
  // Handle string errors
  const message = typeof response === 'string' ? response : `Request failed with status ${status}`;
  return new ZkAsterError(message, { error: message, code: status });
}

/**
 * Check if error is a ZkAsterError
 */
export function isZkAsterError(error: any): error is ZkAsterError {
  return error instanceof ZkAsterError;
}

