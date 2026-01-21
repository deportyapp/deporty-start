// Espera a que el contenido del HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageContainer = document.getElementById('form-message');
    const forgotPasswordLink = document.querySelector('[data-action="forgot-password"]');

    // Verificamos que el formulario exista antes de continuar
    if (!form) {
        console.error('No se encontró el formulario de login');
        return;
    }

    // --- FUNCIONES AUXILIARES ---
    
    /**
     * Muestra un mensaje al usuario
     * @param {string} message - El texto del mensaje
     * @param {string} type - Tipo de mensaje: 'error', 'success', 'info'
     */
    const showMessage = (message, type = 'error') => {
        messageContainer.textContent = message;
        messageContainer.className = `form__message form__message--${type}`;
    };

    /**
     * Limpia el mensaje mostrado
     */
    const clearMessage = () => {
        messageContainer.textContent = '';
        messageContainer.className = 'form__message';
    };

    /**
     * Valida el formato del email
     * @param {string} email - Email a validar
     * @returns {boolean} - true si es válido, false si no
     */
    const isValidEmail = (email) => {
        // Expresión regular para validar emails
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // --- MANEJO DEL FORMULARIO ---
    
    /**
     * Maneja el envío del formulario
     * @param {Event} event - Evento del submit
     */
    const handleFormSubmit = async (event) => {
        // Prevenir que el formulario se envíe de forma tradicional
        event.preventDefault();
        
        // Limpiar mensajes anteriores
        clearMessage();

        // Obtener los valores de los campos
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // --- VALIDACIONES ---
        
        // 1. Verificar que el email no esté vacío
        if (!email) {
            showMessage('Por favor, ingresa tu correo electrónico.', 'error');
            emailInput.focus();
            return;
        }

        // 2. Verificar que el email tenga formato válido
        if (!isValidEmail(email)) {
            showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
            emailInput.focus();
            return;
        }

        // 3. Verificar que la contraseña no esté vacía
        if (!password) {
            showMessage('Por favor, ingresa tu contraseña.', 'error');
            passwordInput.focus();
            return;
        }

        // 4. Verificar longitud mínima de contraseña
        if (password.length < 8) {
            showMessage('La contraseña debe tener al menos 8 caracteres.', 'error');
            passwordInput.focus();
            return;
        }

        // --- SIMULACIÓN DE LOGIN ---
        // Por ahora, como no tenemos backend, vamos a simular el proceso
        
        try {
            // Mostrar mensaje de carga
            showMessage('Iniciando sesión...', 'info');

            // Simular una petición al servidor (esperar 1.5 segundos)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // SIMULACIÓN: Verificar credenciales hardcodeadas
            // En producción, esto se haría en el backend
            if (email === 'demo@deporty.com' && password === 'deporty2025') {
                // Login exitoso
                showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
                
                // Guardar información del usuario (simulado)
                localStorage.setItem('userEmail', email);
                localStorage.setItem('isLoggedIn', 'true');
                
                // Redirigir después de 1 segundo
                setTimeout(() => {
                    // Por ahora redirigimos al index, luego será al dashboard
                    window.location.href = 'index.html';
                }, 1000);
                
            } else {
                // Credenciales incorrectas
                showMessage('Email o contraseña incorrectos. Intenta nuevamente.', 'error');
            }

        } catch (error) {
            console.error('Error durante el login:', error);
            showMessage('Ocurrió un error. Por favor, intenta más tarde.', 'error');
        }
    };

    // --- MANEJO DEL LINK "OLVIDASTE TU CONTRASEÑA" ---
    
    /**
     * Maneja el click en "Olvidaste tu contraseña"
     * @param {Event} event - Evento del click
     */
    const handleForgotPassword = (event) => {
        event.preventDefault();
        
        // Por ahora solo mostramos un mensaje
        // En el futuro, esto abrirá un modal o redirigirá a otra página
        alert('La función de recuperación de contraseña estará disponible próximamente.\n\nPor ahora, puedes usar:\nEmail: demo@deporty.com\nContraseña: deporty2025');
    };

    // --- VINCULACIÓN DE EVENTOS ---
    
    form.addEventListener('submit', handleFormSubmit);
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }

    // --- LIMPIAR MENSAJES AL ESCRIBIR ---
    // Esto mejora la experiencia del usuario
    emailInput.addEventListener('input', clearMessage);
    passwordInput.addEventListener('input', clearMessage);

    // --- MENSAJE DE CONSOLA PARA DESARROLLO ---
    console.log('🔐 Sistema de login cargado');
    console.log('📧 Para probar, usa: demo@deporty.com / deporty2025');
});
