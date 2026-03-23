# CrudUsuarios

Aplicación CRUD de ejemplo con Angular, llamada “BIO-COMMAND”.
Permite crear, listar, filtrar, actualizar y eliminar usuarios usando una API externa y caché en LocalStorage.

## 🌟 Tabla de contenidos

1. [Descripción](#descripción)
2. [Tecnologías](#tecnologías)
3. [Instalación](#instalación)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Rutas y componentes](#rutas-y-componentes)
6. [Servicios e interacción con API](#servicios-e-interacción-con-api)
7. [Flujo principal de la app](#flujo-principal-de-la-app)
8. [Pruebas](#pruebas)
9. [Mejoras sugeridas](#mejoras-sugeridas)

---

## 📝 Descripción

`CrudUsuarios` es un proyecto Angular standalone que ofrece:

- Visualización de directorio de usuarios.
- Búsqueda en tiempo real (filtrado local).
- Creación y edición de usuario con formulario reactivo.
- Visualización de detalle individual.
- Eliminación desde lista y detalle.
- Sincronización de caché con `localStorage`.

La UI usa Bootstrap e iconos de Bootstrap Icons y además maneja estados de carga y fallback de imagenes.

---

## 🛠️ Tecnologías

- Angular (Standalone components)
- TypeScript
- RxJS
- Angular Router
- Angular Reactive Forms
- Angular HttpClient
- localStorage
- CSS / Bootstrap

---

## 🚀 Instalación

1. Clonar repo:

```bash
git clone <URL_DEL_REPO>
cd crud-usuarios
```

2. Instalar dependencias:

```bash
npm install
```

3. Servir localmente:

```bash
npm start
```

4. Abrir navegador:

- `http://localhost:4200/`

---

## 📁 Estructura del proyecto

- `src/app/app.ts`: componente app root (standalone + router).
- `src/app/app.routes.ts`: configuración de rutas.
- `src/app/components/home/*`: listado principal + búsqueda + eliminación.
- `src/app/components/user-detail/*`: vista detallada de usuario + eliminar + ir atrás.
- `src/app/components/user-form/*`: creación + edición de usuario con `FormGroup`.
- `src/app/services/users.ts`: servicio de API y LocalStorage.
- `src/app/interfaces/user.ts`: interface `User`.

---

## 🧭 Rutas y componentes

- `/home` → `HomeComponent`
- `/user/:id` → `UserDetailComponent`
- `/newuser` → `UserFormComponent` (crear)
- `/updateuser/:id` → `UserFormComponent` (editar)
- `**` → redirige a `/home`

### HomeComponent (`src/app/components/home/home.ts`)

- Propiedades:
  - `users: User[]` nda global.
  - `filteredUsers: User[]` resultados en búsqueda.
- `ngOnInit`: carga localStorage y luego API.
- `onSearch(event)`: filtra por nombre, apellidos, username, email.
- `deleteUser(id)`: `confirm()`, `usersService.delete` y actualización de arrays locales.

### UserDetailComponent (`src/app/components/user-detail/user-detail.ts`)

- Lee `id` por `ActivatedRoute`.
- Carga usuario por `getById(id)`.
- `deleteUser()`: elimina y navega a `/home`.
- `goBack()`: navegación con `Location.back()`.

### UserFormComponent (`src/app/components/user-form/user-form.ts`)

- `FormGroup` con campos: `first_name`, `last_name`, `username`, `email`, `image`, `password`.
- `isUpdate` decide flujo.
- `ngOnInit`: verifica ruta para modo create/update.
- `onSubmit`: POST o PUT según modo.
- `currentImage` y `handleImageError` para preview y fallback.

---

## 🌐 Servicio API (UsersService)

`src/app/services/users.ts`

- `getAll()`: GET `/api/users`, guarda `response.results` en `localStorage`.
- `getById(id)`: GET `/api/users/:id`, normaliza `results/data`, fallback localStorage en error.
- `create(user)`: POST `/api/users`.
- `update(user)`: PUT `/api/users/:id`, actualiza `localStorage` existiendo.
- `delete(id)`: DELETE `/api/users/:id`, remueve cache local.
- `getLocalStorageUsers()`: lee JSON local.
- `getLocalUserById(id)`: busca en cache.

---

## 🔁 Flujo principal de data

1. `HomeComponent` monta, lee cache y renderiza rapido.
2. `getAll()` refresca desde API, actualiza lista y cache.
3. `onSearch()` mantiene `users` inmutables + `filteredUsers` filtrados.
4. `deleteUser()` elimina local y remoto.
5. `UserFormComponent` crea o edita y redirige a `/home`.
6. `UserDetailComponent` muestra ficha y permite borrar.

---

## 🧪 Pruebas

- `npm test` ➜ ejecuta tests (Jasmine/Karma o Vitest según configuración actual).
- El proyecto ya incluye archivos spec para:
  - `src/app/app.spec.ts`
  - `src/app/components/home/home.spec.ts`
  - `src/app/components/user-detail/user-detail.spec.ts`
  - `src/app/components/user-form/user-form.spec.ts`
  - `src/app/services/users.spec.ts`

> Nota: ajusta las pruebas si tu API cambia los códigos de respuesta o la forma de la carga en local.

---

## 💡 Mejoras sugeridas (roadmap)

- Añadir paginación + ordenación.
- Añadir estados de carga (`loading`) y mensajes de error UI.
- Refactor a RxJS `signal` / `ngrx` / `@ngrx/component` para rendimiento.
- Validación avanzada (nombre único, contraseña fuerte, URL imagen válida).
- Paginación en servidor y debounce de búsqueda.
- Pruebas E2E (`Cypress`, `Playwright`).

---

## 📌 Notas importantes

- El código ya utiliza la técnica de `ChangeDetectorRef.detectChanges()` para forzar render cuando se actualiza desde callback asíncrono, útil sobretodo con datos cargados fuera de Angular zone.
- Mantener `localStorage` sincronizado evita pérdida de datos en recarga.

---

## 🖊️ Licencia

Este proyecto es un ejemplo educativo de implementación CRUD con Angular.
