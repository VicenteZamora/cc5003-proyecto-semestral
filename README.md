# Foro de Videojuegos

**Fecha:** 23 de noviembre de 2025
**Integrantes:**
- Vicente Álamos V.
- Juan Pablo Sánchez B.
- Vicente Zamora S.

---
## Tema del Proyecto
El mundo de los videojuegos amplio y complejo, caracterizado por la diversidad de personajes, técnicas y torneos que lo componen. Sin embargo, gran parte de la información relacionada con este género se encuentra dispersa en foros, tutoriales de YouTube y redes sociales, lo que dificulta el acceso a datos organizados y confiables.

La solución propuesta busca centralizar y estructurar este conocimiento en una plataforma para diferentes tipos de usuarios. El público objetivo contempla jugadores novatos, interesados en aprender las mecánicas básicas de los videojuegos de pelea; jugadores experimentados, que deseen compartir estrategias avanzadas y perfeccionar sus habilidades; y fanáticos en general, motivados por conocer curiosidades, explorar contenido especializado y seguir la escena competitiva.

---
## Estado Global

### Librería Utilizada
**Zustand**
### Stores Implementados
- **Store de Usuario:** Maneja la autenticación, datos del usuario actual, tokens JWT y sesión.
- **Store de Guías:** Gestiona el estado de las guías y publicaciones, incluyendo listados y creación.
---
## Ruteo y Navegación
### React Router
La aplicación utiliza React Router para la navegación entre vistas.
### Mapa de Rutas
#### Rutas Públicas
- `/` - Página de inicio, lista de juegos
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios
- `/games/:id` - Vista particular de un juego
- `/games/:id/guides/:guideId` Vista particular de una guía
#### Rutas Protegidas
- `/profile` - Perfil del usuario autenticado
- `/guides/create` - Crear nueva guía
- `/posts/create` - Crear nuevo comentario (post)
- `/posts/:id/edit` - Editar comentario propio
-  `/posts/:id/delete` - Eliminar comentario propio
### Flujo de Autenticación
1. **Registro de Usuario**
	- El usuario completa el formulario en `/register`
	- Los datos se envían a `POST /api/users`
	- La contraseña se hashea con bcrypt antes de guardarse en MongoDB
	- Redirección automática a `/login`
2. **Inicio de Sesión**
	- El usuario ingresa credenciales en `/login`
	- Se envía petición a `POST /api/login`
	- El backend valida las credenciales y genera un JWT
	- El token JWT se almacena en una cookie `httpOnly`
	- Se genera y envía un token CSRF único - Redirección a la página principal o perfil
3. **Acceso a Rutas Protegidas**
	- Cada petición a rutas protegidas incluye el token JWT en las cookies
	- El middleware `withUser` valida el token antes de permitir acceso
	- Si el token es válido, se permite la operación
	- Si el token es inválido o expiró (1 hora), se redirige a `/login`
4. **Persistencia de Sesión**
	- El token se mantiene en cookies del navegador
	- Al recargar la página (F5), se verifica el token con `GET /api/login/me`
	- Si es válido, el usuario permanece autenticado
5. **Cierre de Sesión**
	- El usuario hace click en logout
	- Se envía petición a `POST /api/login/logout`
	- Se eliminan las cookies con el JWT y token CSRF
	- Se limpia el estado global del usuario
	- Redirección a la página pública
---
## Pruebas E2E
### Herramienta Utilizada
**Playwright**
### Casos de Prueba Implementados
1. **Flujo de Autenticación**
	- Login exitoso y erróneo
	- Persistencia de sesión
    - Registro de nuevo usuario exitoso y erróneo
    - Acceso a rutas protegidas
    - Logout
2. **(Casi) CRUD de Guías**
    - Creación de nueva guía (autenticado)
    - Listado de guías
    - ~~Edición de guías propias~~
    - ~~Eliminación de guías propias~~
3. **CRUD de Comentarios**
    - Creación de nuevo comentario (autenticado)
    - Listado de comentarios
    - Edición de comentarios propios
    - Eliminación de comentarios propios
### Instrucciones para Ejecutar los Tests

```bash
# Navebar al backend
cd backend
npm run start:test

# Navegar al frontend
cd frontend
npm run dev

# Navegar a la carpeta de tests E2E
cd e2etests
npm run test
```

Todos ellos corren en los tres motores existentes: Chromium, Firefox y Webkit.

---
## Diseño y Estilos
### Librería de Estilos
- **Tailwind CSS**
### Decisiones de Diseño
#### Seguridad y UX 
- Los formularios que requieren un token de usuario no son accesibles para una persona que no tiene sesión iniciada. Para evitar errores en backend, se inhabilita el envío de datos en este caso. 
- Redirección automática a `/login` cuando se intenta acceder a rutas protegidas sin autenticación.
#### Componentes y Patrones
- **Sidebar persistente:** Navegación principal siempre visible con enlaces a secciones clave (Juegos, Guías, Perfil) 
- **Cards responsivas:** Uso de tarjetas para mostrar juegos y guías con imagen, título y descripción breve.
- **Formularios validados:** Validación en tiempo real con mensajes de error específicos bajo cada campo.
---
## Backend y API
### Base de Datos
MongoDB con modelos Mongoose para `User`, `Guide` y `Post`.
### Sistema de Autenticación
- Implementación de JWT almacenado en cookies
- Generación de tokens CSRF únicos por sesión
- Hash de contraseñas con bcrypt
- Tokens con expiración de 1 hora
### Endpoints Principales
#### Autenticación

| Método | Endpoint            | Descripción                           | Autenticación |
| ------ | ------------------- | ------------------------------------- | ------------- |
| POST   | `/api/login`        | Iniciar sesión y obtener token JWT    | No            |
| POST   | `/api/login/logout` | Cerrar sesión del usuario             | No            |
| GET    | `/api/login/me`     | Obtener datos del usuario autenticado | Sí            |
#### Juegos
| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/games` | Listar todos los juegos | No |
| GET | `/api/games/:id` | Obtener juego específico por ID | No |
| POST | `/api/games` | Crear nuevo juego | Sí |
| PUT | `/api/games/:id` | Actualizar juego propio | Sí |
| DELETE | `/api/games/:id` | Eliminar juego propio | Sí |
#### Guías

| Método | Endpoint          | Descripción             | Autenticación |
| ------ | ----------------- | ----------------------- | ------------- |
| GET    | `/api/guides`     | Listar todas las guías  | No            |
| POST   | `/api/guides`     | Crear nueva guía        | Sí            |
| GET    | `/api/guides/:id` | Obtener guía específica | No            |
| PUT    | `/api/guides/:id` | Actualizar guía propia  | Sí            |
| DELETE | `/api/guides/:id` | Eliminar guía propia    | Sí            |
#### Comentarios (posts)
| Método | Endpoint               | Descripción                          | Autenticación |
| ------ | ---------------------- | ------------------------------------ | ------------- |
| GET    | `/api/posts`           | Listar todos los posts               | No            |
| GET    | `/api/posts/:id`       | Obtener post específico por ID       | No            |
| GET    | `/api/posts/guide/:id` | Obtener posts de una guía específica | No            |
| POST   | `/api/posts/guide/:id` | Crear post asociado a una guía       | Sí            |
| PUT    | `/api/posts/:id`       | Actualizar post propio               | Sí            |
| DELETE | `/api/posts/:id`       | Eliminar post propio                 | Sí            |
#### Usuarios

| Método | Endpoint     | Descripción                 | Autenticación |
| ------ | ------------ | --------------------------- | ------------- |
| POST   | `/api/users` | Crear usuario en el sistema | No            |

---
## Despliegue en Producción
### URL de la Aplicación
**fullstack.dcc.uchile.cl:7190**
### Variables de Entorno
Las siguientes variables deben configurarse en el archivo `.env` para el backend:

```
- MONGODB_URI
- TEST_MONGODB_URI
- MONGODB_DBNAME
- TEST_MONGODB_DBNAME
- PORT
- HOST
```
### Instrucciones de Despliegue
#### Clonar el respositorio
```bash
git clone [repositorio]
cd [proyecto]
```
#### Backend
```bash
cd backend && npm install && npm run build && npm run build:ui
```
#### Correr la aplicación
```bash
cd backend && npm start
```
---
## Estructura del Proyecto

```
proyecto/
├── frontend/          # Aplicación React
├── backend/           # API con Express y MongoDB
├── e2etests/          # Tests E2E con Playwright
└── README.md          # Este archivo
```

---
## Buenas Prácticas Implementadas
- TypeScript estricto sin uso injustificado de `any` 
- Manejo de errores con códigos HTTP apropiados
- Variables sensibles en archivos `.env` (no incluidos en el repositorio)
- Validación de datos en frontend y backend
- Protección de rutas según permisos de usuario
- Separación de responsabilidades en controladores y middlewares

## Justificación uso de any's
Se utilizaron any's en el contexto de atrapar errores, solamente en:
- `FormComment.tsx` línea 40
- `FormGuide.tsx` línea 61
- `login.tsx` línea 35

En JavaScript/TypeScript, un `throw` puede lanzar cualquier tipo de valor (string, number, object, Error, etc.), por lo que `any` es semánticamente correcto en un catch block cuando no vas a hacer type checking del error.

---
## Instalación y Ejecución Local
Para una ejecución local en un entorno de desarrollo utilizar:
### Backend

```bash
cd backend
npm install
npm run dev
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```
### Tests E2E
#### Backend
```bash
cd backend 
npm run start:test
```
#### Tests
```bash
cd e2etests
npm install
npm run test
```

---
## Trabajo Futuro
- **Quitar todo any** para mejorar la calidad del código.
- **Mejorar el estilo de la aplicación** con imágenes representativas tanto para juegos como para guías específicas
- **Implementar personalización de usuario:** cambio de colores en la sidebar e imagen de perfil
- **Añadir pestañas por personaje para juegos con rosters complejos**, permitiendo crear páginas dedicadas dentro de cada juego y facilitando el acceso interactivo a la información más allá de los filtros de búsqueda
- **Implementar vista de perfil** para que los usuarios tengan acceso directo a las guías y comentarios que crearon.
