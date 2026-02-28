/**
 * Centralized error handling
 * Provides typed error classes and utility functions
 */

import { createLogger } from './logger';

const logger = createLogger('ErrorHandler');

export type ErrorCode =
	| 'AUTH_REQUIRED'
	| 'INVALID_CREDENTIALS'
	| 'USER_NOT_FOUND'
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'VALIDATION_ERROR'
	| 'INTERNAL_ERROR'
	| 'SERVICE_UNAVAILABLE'
	| 'RATE_LIMIT'
	| 'CONFLICT';

export class AppError extends Error {
	constructor(
		public code: ErrorCode,
		public statusCode: number,
		message: string,
		public context?: Record<string, unknown>
	) {
		super(message);
		this.name = 'AppError';
	}
}

/**
 * Common error factory functions
 */
export const errors = {
	authRequired: () =>
		new AppError('AUTH_REQUIRED', 401, 'Authentication required', undefined),

	invalidCredentials: () =>
		new AppError('INVALID_CREDENTIALS', 401, 'Invalid email or password', undefined),

	userNotFound: () => new AppError('USER_NOT_FOUND', 404, 'User not found', undefined),

	unauthorized: (message = 'Unauthorized') =>
		new AppError('UNAUTHORIZED', 403, message, undefined),

	forbidden: (message = 'Forbidden') =>
		new AppError('FORBIDDEN', 403, message, undefined),

	notFound: (resource: string) =>
		new AppError('NOT_FOUND', 404, `${resource} not found`, undefined),

	validationError: (message: string, details?: Record<string, unknown>) =>
		new AppError('VALIDATION_ERROR', 400, message, details),

	internalError: (message = 'An unexpected error occurred', context?: Record<string, unknown>) =>
		new AppError('INTERNAL_ERROR', 500, message, context),

	serviceUnavailable: () =>
		new AppError('SERVICE_UNAVAILABLE', 503, 'Service temporarily unavailable', undefined),

	rateLimit: () =>
		new AppError('RATE_LIMIT', 429, 'Too many requests. Please try again later.', undefined),

	conflict: (message: string) =>
		new AppError('CONFLICT', 409, message, undefined)
};

export interface ErrorResponse {
	error: string;
	code: ErrorCode;
	status: number;
	context?: Record<string, unknown>;
}

/**
 * Handle errors and return standardized error response
 * Logs errors appropriately based on severity
 */
export function handleError(error: unknown): ErrorResponse {
	if (error instanceof AppError) {
		if (error.statusCode >= 500) {
			logger.error(error.message, {
				code: error.code,
				statusCode: error.statusCode,
				context: error.context
			});
		} else {
			logger.warn(error.message, { code: error.code });
		}

		return {
			error: error.message,
			code: error.code,
			status: error.statusCode,
			context: error.context
		};
	}

	if (error instanceof Error) {
		logger.error('Unhandled error', {
			message: error.message,
			stack: error.stack
		});

		return {
			error: 'An unexpected error occurred',
			code: 'INTERNAL_ERROR',
			status: 500
		};
	}

	logger.error('Unknown error', { error });

	return {
		error: 'An unexpected error occurred',
		code: 'INTERNAL_ERROR',
		status: 500
	};
}
