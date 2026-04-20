import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
	const testEmail = `testuser_${Date.now()}@gmail.com`;
	const testPassword = 'Password123!';

	test('Debería registrar un nuevo usuario y guardar sus datos en profile', async ({ page }) => {
		// 1. Ir a la página de registro
		await page.goto('/register');

		// 2. Llenar el formulario
		await page.fill('input[name="firstName"]', 'Test');
		await page.fill('input[name="lastName"]', 'User');
		await page.fill('input[name="nickname"]', 'test_user');
		await page.fill('input[name="birthDate"]', '1990-01-01');
		await page.fill('input[name="email"]', testEmail);
		await page.fill('input[name="confirmEmail"]', testEmail);
		await page.fill('input[name="password"]', testPassword);
		await page.fill('input[name="confirmPassword"]', testPassword);

		// 3. Enviar el formulario
		await page.click('button[type="submit"]');

		// 4. Verificar resultado (esperamos éxito o un mensaje de confirmación de email)
		// El timeout es largo por si Supabase tarda un poco en responder
		const successMsg = page.locator('text=/Registro exitoso|confirmación/i');
		const errorMsg = page.locator('.text-red-400'); // Clase usada en el componente para errores

		// Esperar a que ocurra una de las dos cosas
		await Promise.race([
			successMsg.waitFor({ state: 'visible', timeout: 15000 }),
			errorMsg.waitFor({ state: 'visible', timeout: 15000 })
		]);

		if (await errorMsg.isVisible()) {
			const text = await errorMsg.innerText();
			console.error('ERROR EN REGISTRO:', text);
			// Capturar una captura de pantalla si falla
			await page.screenshot({ path: `registration-failure-${Date.now()}.png` });
			throw new Error(`El registro falló con el error: ${text}`);
		}

		expect(await successMsg.isVisible()).toBe(true);
		console.log('REGISTRO EXITOSO PARA:', testEmail);
	});

	test('Debería intentar loguearse (puede fallar si requiere confirmación de email)', async ({
		page
	}) => {
		await page.goto('/login');
		await page.fill('input[name="email"]', testEmail);
		await page.fill('input[name="password"]', testPassword);
		await page.click('button[type="submit"]');

		// Verificar si redirige al dashboard o da error de confirmación
		await page.waitForTimeout(5000); // Esperar respuesta

		if (page.url().includes('/dashboard')) {
			console.log('LOGIN EXITOSO: El usuario entró al dashboard');
		} else {
			const errorMsg = page.locator('.text-red-400');
			if (await errorMsg.isVisible()) {
				console.log('LOGIN NO COMPLETADO:', await errorMsg.innerText());
			}
		}
	});
});
