/**
 * Valida el formato de un correo electrónico
 */
export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Calcula la fortaleza de una contraseña
 * @returns Un número del 0 al 5 indicando la fortaleza
 */
export function validatePasswordStrength(password: string): number {
	let score = 0;
	if (password.length >= 8) score++;
	if (/[A-Z]/.test(password)) score++;
	if (/[a-z]/.test(password)) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[^A-Za-z0-9]/.test(password)) score++;
	return score;
}

/**
 * Obtiene el texto descriptivo de la fortaleza de la contraseña
 */
export function getPasswordStrengthText(score: number): string {
	if (score <= 2) return 'Débil';
	if (score === 3) return 'Media';
	if (score === 4) return 'Fuerte';
	return 'Muy Fuerte';
}

/**
 * Obtiene el color de la barra de fortaleza de contraseña
 */
export function getPasswordStrengthColor(score: number): string {
	if (score <= 2) return 'bg-red-500';
	if (score === 3) return 'bg-yellow-500';
	if (score === 4) return 'bg-blue-500';
	return 'bg-green-500';
}
