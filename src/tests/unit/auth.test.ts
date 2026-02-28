import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errors, handleError, AppError } from '$lib/server/errors';

describe('Auth Errors', () => {
	it('should create auth required error', () => {
		const error = errors.authRequired();
		expect(error).toBeInstanceOf(AppError);
		expect(error.statusCode).toBe(401);
		expect(error.code).toBe('AUTH_REQUIRED');
		expect(error.message).toBe('Authentication required');
	});

	it('should create invalid credentials error', () => {
		const error = errors.invalidCredentials();
		expect(error.statusCode).toBe(401);
		expect(error.code).toBe('INVALID_CREDENTIALS');
	});

	it('should create user not found error', () => {
		const error = errors.userNotFound();
		expect(error.statusCode).toBe(404);
		expect(error.code).toBe('USER_NOT_FOUND');
	});

	it('should create unauthorized error', () => {
		const error = errors.unauthorized('Custom message');
		expect(error.statusCode).toBe(403);
		expect(error.message).toBe('Custom message');
	});
});

describe('Error Handling', () => {
	it('should handle AppError', () => {
		const appError = errors.validationError('Invalid input', { field: 'email' });
		const response = handleError(appError);

		expect(response.status).toBe(400);
		expect(response.code).toBe('VALIDATION_ERROR');
		expect(response.error).toBe('Invalid input');
		expect(response.context).toEqual({ field: 'email' });
	});

	it('should handle native Error', () => {
		const nativeError = new Error('Something went wrong');
		const response = handleError(nativeError);

		expect(response.status).toBe(500);
		expect(response.code).toBe('INTERNAL_ERROR');
	});

	it('should handle unknown error', () => {
		const response = handleError('some random string');

		expect(response.status).toBe(500);
		expect(response.code).toBe('INTERNAL_ERROR');
	});

	it('should log errors appropriately', () => {
		vi.spyOn(console, 'error');

		const error = errors.internalError('Database connection failed', {
			service: 'postgres'
		});
		handleError(error);

		expect(console.error).toHaveBeenCalled();
	});
});

describe('Error Codes', () => {
	it('should have correct status codes', () => {
		expect(errors.authRequired().statusCode).toBe(401);
		expect(errors.unauthorized().statusCode).toBe(403);
		expect(errors.notFound('user').statusCode).toBe(404);
		expect(errors.validationError('test').statusCode).toBe(400);
		expect(errors.internalError().statusCode).toBe(500);
		expect(errors.serviceUnavailable().statusCode).toBe(503);
		expect(errors.rateLimit().statusCode).toBe(429);
		expect(errors.conflict('test').statusCode).toBe(409);
	});
});
