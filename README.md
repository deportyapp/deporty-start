# Deporty UI

Este proyecto usa SvelteKit + Tailwind y autenticacion con Supabase (email/password y OAuth Google).

## Pantallas disponibles

- Home (landing visual)
- Login (interfaz visual)
- Registro (interfaz visual)

## Variables de entorno

Crea un archivo `.env` en la raiz con:

```env
PUBLIC_SUPABASE_URL=tu_project_url
PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Configuracion de Auth (Supabase)

1. En Supabase, activa Google en `Authentication -> Providers`.
2. En `Authentication -> URL Configuration` define:
   - `Site URL`: tu URL de produccion en Vercel (por ejemplo `https://deporty-start.vercel.app`).
   - `Additional Redirect URLs`:
     - `http://localhost:5173/auth/callback`
     - `https://deporty-start.vercel.app/auth/callback` (o tu dominio final)

Nota: el proyecto usa callback en `/auth/callback`.

## Scripts

```bash
pnpm run dev
pnpm run build
pnpm run preview
pnpm run check
pnpm run lint
pnpm run format
```
