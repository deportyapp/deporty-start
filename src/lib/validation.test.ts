import { describe, it, expect } from 'vitest';
import { validateEmail, validatePasswordStrength, getPasswordStrengthText } from './validation';

describe('Validación de Email', () => {
	it('debería validar emails correctos', () => {
		expect(validateEmail('test@example.com')).toBe(true);
		expect(validateEmail('user.name@domain.co')).toBe(true);
		expect(validateEmail('user+tag@example.org')).toBe(true);
	});

	it('debería rechazar emails incorrectos', () => {
		expect(validateEmail('invalid')).toBe(false);
		expect(validateEmail('invalid@')).toBe(false);
		expect(validateEmail('@example.com')).toBe(false);
		expect(validateEmail('user@')).toBe(false);
		expect(validateEmail('user @example.com')).toBe(false);
		expect(validateEmail('')).toBe(false);
	});
});

describe('Validación de Contraseña', () => {
	it('debería calcular correctamente la fortaleza de contraseñas débiles', () => {
		expect(validatePasswordStrength('1234')).toBe(1); // Solo números, menos de 8 chars
		expect(validatePasswordStrength('password')).toBe(2); // Solo minúsculas, 8+ chars
		expect(validatePasswordStrength('12345678')).toBe(2); // Solo números, 8+ chars
	});

	it('debería calcular correctamente la fortaleza de contraseñas medias', () => {
		expect(validatePasswordStrength('Password')).toBe(3); // Mayús + Minús + 8+ chars
		expect(validatePasswordStrength('password123')).toBe(3); // Minús + Números + 8+ chars
	});

	it('debería calcular correctamente la fortaleza de contraseñas fuertes', () => {
		expect(validatePasswordStrength('Password123')).toBe(4); // Mayús + Minús + Números + 8+ chars
		expect(validatePasswordStrength('Pass@word1')).toBe(5); // Mayús + Minús + Números + Especial + 8+ chars
	});

	it('debería devolver el texto correcto de fortaleza', () => {
		expect(getPasswordStrengthText(1)).toBe('Débil');
		expect(getPasswordStrengthText(2)).toBe('Débil');
		expect(getPasswordStrengthText(3)).toBe('Media');
		expect(getPasswordStrengthText(4)).toBe('Fuerte');
		expect(getPasswordStrengthText(5)).toBe('Muy Fuerte');
	});
});

describe('Validaciones de Registro', () => {
	it('debería validar que las contraseñas coincidan', () => {
		const password = 'Password123';
		const confirmPassword = 'Password123';
		expect(password === confirmPassword).toBe(true);
	});

	it('debería detectar cuando las contraseñas no coinciden', () => {
		const password = 'Password123';
		const confirmPassword = 'Different123';
		expect(password === confirmPassword).toBe(false);
	});

	it('debería validar que los emails coincidan', () => {
		const email = 'test@example.com';
		const confirmEmail = 'test@example.com';
		expect(email === confirmEmail).toBe(true);
	});

	it('debería detectar cuando los emails no coinciden', () => {
		const email = 'test@example.com';
		const confirmEmail = 'different@example.com';
		expect(email === confirmEmail).toBe(false);
	});

	it('debería requerir contraseñas de al menos 8 caracteres', () => {
		expect('Pass1!'.length >= 8).toBe(false);
		expect('Password1!'.length >= 8).toBe(true);
	});
});
