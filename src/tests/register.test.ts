import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Helpers ──────────────────────────────────────────

function createFormData(data: Record<string, string>): FormData {
	const fd = new FormData();
	for (const [key, value] of Object.entries(data)) {
		fd.set(key, value);
	}
	return fd;
}

function createMockLocals(
	overrides: {
		signUpReturn?: { data: unknown; error: unknown };
	} = {}
) {
	return {
		supabase: {
			auth: {
				signUp: vi.fn().mockResolvedValue(
					overrides.signUpReturn ?? {
						data: {
							user: { id: 'test-uuid', identities: [{}] },
							session: null
						},
						error: null
					}
				)
			},
			from: vi.fn().mockReturnValue({
				upsert: vi.fn().mockResolvedValue({ error: null })
			})
		},
		safeGetSession: vi.fn()
	};
}

const validInput = {
	firstName: 'Juan',
	lastName: 'Pérez',
	nickname: 'JP',
	birthDate: '1990-05-15',
	phone: '+573001234567',
	email: 'juan@example.com',
	password: 'Str0ngP@ss!'
};

// ─── Import the action (lazy so mocks are set up first) ──────
// We dynamically import the actions to test them in isolation
async function getRegisterAction() {
	const mod = await import('../routes/register/+page.server.js');
	return mod.actions.register;
}

// ─── Tests ────────────────────────────────────────────

describe('Register Action - Server-side Validation', () => {
	it('should fail with missing_fields when firstName is empty', async () => {
		const action = await getRegisterAction();
		const formData = createFormData({ ...validInput, firstName: '' });
		const locals = createMockLocals();

		const result = await action({
			request: new Request('http://localhost', { method: 'POST', body: formData }),
			locals
		} as any);

		expect(result?.status).toBe(400);
		expect(result?.data?.error).toBe('missing_fields');
	});

	it('should fail with missing_fields when email is empty', async () => {
		const action = await getRegisterAction();
		const formData = createFormData({ ...validInput, email: '' });
		const locals = createMockLocals();

		const result = await action({
			request: new Request('http://localhost', { method: 'POST', body: formData }),
			locals
		} as any);

		expect(result?.status).toBe(400);
		expect(result?.data?.error).toBe('missing_fields');
	});

	it('should fail with missing_fields when password is empty', async () => {
		const action = await getRegisterAction();
		const formData = createFormData({ ...validInput, password: '' });
		const locals = createMockLocals();

		const result = await action({
			request: new Request('http://localhost', { method: 'POST', body: formData }),
			locals
		} as any);

		expect(result?.status).toBe(400);
		expect(result?.data?.error).toBe('missing_fields');
	});

	it('should fail with password_short when password is less than 8 chars', async () => {
		const action = await getRegisterAction();
		const formData = createFormData({ ...validInput, password: 'abc1234' });
		const locals = createMockLocals();

		const result = await action({
			request: new Request('http://localhost', { method: 'POST', body: formData }),
			locals
		} as any);

		expect(result?.status).toBe(400);
		expect(result?.data?.error).toBe('password_short');
	});

	it('should accept password with exactly 8 characters and require confirmation', async () => {
		const action = await getRegisterAction();
		const formData = createFormData({ ...validInput, password: 'abcd1234' });
		const locals = createMockLocals();

		const result = await action({
			request: new Request('http://localhost', { method: 'POST', body: formData }),
			locals
		} as any);

		expect(result).toEqual({ success: true, needsConfirmation: true });
	});

	it('should fail with invalid_birth_date when date is invalid', async () => {
		const action = await getRegisterAction();
		const formData = createFormData({ ...validInput, birthDate: 'not-a-date' });
		const locals = createMockLocals();

		const result = await action({
			request: new Request('http://localhost', { method: 'POST', body: formData }),
			locals
		} as any);

		expect(result?.status).toBe(400);
		expect(result?.data?.error).toBe('invalid_birth_date');
	});

	it('should fail with invalid_phone when phone is invalid', async () => {
		const action = await getRegisterAction();
		const formData = createFormData({ ...validInput, phone: '3001234567' });
		const locals = createMockLocals();

		const result = await action({
			request: new Request('http://localhost', { method: 'POST', body: formData }),
			locals
		} as any);

		expect(result?.status).toBe(400);
		expect(result?.data?.error).toBe('invalid_phone');
	});

	it('should detect email_exists when user has no identities', async () => {
		const action = await getRegisterAction();
		const formData = createFormData(validInput);
		const locals = createMockLocals({
			signUpReturn: {
				data: {
					user: { id: 'test-uuid', identities: [] },
					session: null
				},
				error: null
			}
		});

		const result = await action({
			request: new Request('http://localhost', { method: 'POST', body: formData }),
			locals
		} as any);

		expect(result?.status).toBe(400);
		expect(result?.data?.error).toBe('email_exists');
	});

	it('should return confirmation payload on successful signup without session', async () => {
		const action = await getRegisterAction();
		const formData = createFormData(validInput);
		const locals = createMockLocals();

		const result = await action({
			request: new Request('http://localhost', { method: 'POST', body: formData }),
			locals
		} as any);

		expect(result).toEqual({ success: true, needsConfirmation: true });
	});

	it('should pass birth_date in signUp metadata', async () => {
		const action = await getRegisterAction();
		const formData = createFormData(validInput);
		const locals = createMockLocals();

		try {
			await action({
				request: new Request('http://localhost', { method: 'POST', body: formData }),
				locals
			} as any);
		} catch {
			// redirect is expected
		}

		expect(locals.supabase.auth.signUp).toHaveBeenCalledWith(
			expect.objectContaining({
				options: expect.objectContaining({
					data: expect.objectContaining({
						birth_date: '1990-05-15'
					})
				})
			})
		);
	});

	it('should handle auth error with already registered message', async () => {
		const action = await getRegisterAction();
		const formData = createFormData(validInput);
		const locals = createMockLocals({
			signUpReturn: {
				data: { user: null, session: null },
				error: { message: 'User already registered' }
			}
		});

		const result = await action({
			request: new Request('http://localhost', { method: 'POST', body: formData }),
			locals
		} as any);

		expect(result?.status).toBe(400);
		expect(result?.data?.error).toBe('email_exists');
	});
});
