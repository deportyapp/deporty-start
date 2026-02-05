# Testing Documentation

## 📋 Resumen

Este proyecto ahora incluye una suite completa de tests unitarios usando Vitest y Testing Library.

## 🧪 Tests Implementados

### 1. **Tests de AuthStore** (`src/lib/authStore.test.ts`)
Pruebas del store de autenticación:
- Inicialización del store
- Actualización de usuario
- Persistencia en localStorage
- Función de logout
- Manejo de múltiples actualizaciones

### 2. **Tests de Validación** (`src/lib/validation.test.ts`)
Pruebas de las utilidades de validación:
- Validación de formato de email
- Cálculo de fortaleza de contraseña
- Validación de coincidencia de contraseñas
- Validación de coincidencia de emails
- Textos descriptivos de fortaleza

### 3. **Tests de API Auth** (`src/routes/api/auth/auth.test.ts`)
Pruebas de lógica de autenticación:
- Validación de campos obligatorios
- Validación de formato de email en registro
- Validación de longitud de contraseña
- Estructura de objetos de usuario
- Manejo de credenciales

## 🚀 Comandos de Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests sin modo watch
npm test -- --run

# Ejecutar tests con interfaz UI
npm test:ui

# Ejecutar tests con cobertura de código
npm test:coverage
```

## 📁 Estructura de Tests

```
src/
├── lib/
│   ├── authStore.test.ts       # Tests del store de autenticación
│   ├── validation.test.ts      # Tests de validación
│   └── validation.ts           # Utilidades de validación (refactorizadas)
├── routes/
│   └── api/
│       └── auth/
│           └── auth.test.ts    # Tests de API de autenticación
└── tests/
    └── setup.ts                # Configuración global de tests
```

## 🔧 Configuración

### vitest.config.ts
- Configuración de Vitest con soporte para Svelte
- Ambiente jsdom para simular el navegador
- Alias de rutas configurados
- Cobertura de código habilitada

### src/tests/setup.ts
- Mock de localStorage
- Imports globales de testing-library/jest-dom

## ✅ Cobertura de Tests

Los tests actuales cubren:
- ✅ Store de autenticación (authStore)
- ✅ Validaciones de formulario
- ✅ Lógica de API de autenticación
- ✅ Utilidades de validación

## 🎯 Próximos Pasos

Para expandir la cobertura de tests, considera agregar:
- Tests de integración para componentes Svelte
- Tests E2E con Playwright
- Tests de base de datos con mocks
- Tests de endpoints API completos

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [SvelteKit Testing](https://kit.svelte.dev/docs/testing)
