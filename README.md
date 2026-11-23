
# Food Store

Trabajo Práctico Integrador de Programación IV de la Tecnicatura Universitaria en Programación a Distancia - UTN.

Food Store es una aplicación web para la gestión de pedidos de un negocio de comidas. Permite a los clientes consultar el catálogo, administrar un carrito y realizar pedidos. Los administradores pueden gestionar categorías, productos, stock, pedidos y usuarios.

## Tecnologías utilizadas

### Backend

- Python 3.11 a 3.13
- FastAPI
- SQLModel
- PostgreSQL
- Pydantic
- JWT con cookies HttpOnly
- Passlib y bcrypt

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Axios
- TanStack Query
- TanStack Form
- TanStack Table
- Zustand

## Funcionalidades

### Clientes

- Registro e inicio de sesión.
- Consulta del catálogo con búsqueda, filtros y paginación.
- Carrito de compras persistido en el navegador.
- Confirmación de pedidos con dirección de entrega y forma de pago.
- Consulta del historial y detalle de pedidos.
- Cancelación de pedidos pendientes.

### Administradores

- Resumen de pedidos e ingresos.
- Administración de categorías y productos.
- Actualización de stock y disponibilidad.
- Gestión de pedidos y cambios de estado.
- Listado, activación y desactivación de usuarios.

Los pedidos utilizan cuatro estados: `PENDIENTE`, `EN_PREPARACION`, `ENTREGADO` y `CANCELADO`.

La creación y cancelación de pedidos se realizan mediante operaciones transaccionales que descuentan o restituyen el stock según corresponda.

## Arquitectura del proyecto

El proyecto está dividido en dos aplicaciones independientes:

```text
Food-Store_TPI_Programacion-4/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── usuarios/
│   │   │   ├── categorias/
│   │   │   ├── productos/
│   │   │   └── pedidos/
│   │   └── db/
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   ├── shared/
│   │   ├── store/
│   │   └── routes/
│   ├── .env.example
│   └── package.json
└── README.md
```

El backend sigue una arquitectura en capas: Router, Service, Unit of Work, Repository y Model.

El frontend está organizado por funcionalidades (*features*). TanStack Query administra los datos del servidor y Zustand gestiona la sesión y el carrito.

## Requisitos previos

Antes de instalar el proyecto, es necesario contar con:

- Git.
- Python 3.11, 3.12 o 3.13.
- PostgreSQL 15 o superior.
- Node.js 20.19 o superior, compatible con las dependencias del proyecto.
- pnpm 9 o superior.

## Instalación y ejecución

Los ejemplos de comandos están escritos para PowerShell en Windows.

### 1. Clonar el repositorio

```powershell
git clone https://github.com/gastongiorgio/Food-Store_TPI_Programacion-4.git
cd Food-Store_TPI_Programacion-4
```

### 2. Configurar PostgreSQL

Crear una base de datos llamada `foodstore_tpi`.

Desde pgAdmin o una consola SQL conectada al servidor PostgreSQL, ejecutar:

```sql
CREATE DATABASE foodstore_tpi;
```

La base de datos debe estar disponible antes de iniciar el backend.

### 3. Configurar el backend

Ingresar a la carpeta del backend:

```powershell
cd backend
```

Crear y activar un entorno virtual:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Instalar las dependencias:

```powershell
python -m pip install -r requirements.txt
```

Crear el archivo de configuración a partir del ejemplo:

```powershell
Copy-Item .env.example .env
```

Editar `backend/.env` con los datos locales:

```dotenv
DATABASE_URL=postgresql+psycopg2://postgres:TU_CONTRASENA@localhost:5432/foodstore_tpi

SECRET_KEY=REEMPLAZAR_POR_UNA_CLAVE_ALEATORIA_DE_AL_MENOS_32_CARACTERES
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

FRONTEND_ORIGIN=http://localhost:5173
```

Reemplazar `TU_CONTRASENA` por la contraseña del usuario de PostgreSQL y configurar una clave secreta segura.

Para generar una clave aleatoria se puede utilizar:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Copiar el resultado en `SECRET_KEY`.

El archivo `.env` contiene configuración privada y no debe subirse al repositorio.

### 4. Cargar los datos iniciales

Desde la carpeta `backend`, con el entorno virtual activado:

```powershell
python -m app.db.seed
```

El seed crea un administrador, tres categorías y ocho productos iniciales.

Es idempotente: puede ejecutarse nuevamente sin duplicar los registros iniciales.

### 5. Iniciar el backend

Ejecutar:

```powershell
uvicorn app.main:app --reload
```

El servidor estará disponible en:

- API: http://localhost:8000
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

Todos los endpoints de la aplicación utilizan el prefijo `/api/v1`.

### 6. Configurar el frontend

Abrir otra terminal y ubicarse en la carpeta `frontend` del proyecto:

```powershell
cd frontend
```

Instalar las dependencias:

```powershell
pnpm install
```

Crear el archivo de configuración:

```powershell
Copy-Item .env.example .env
```

Verificar que `frontend/.env` contenga:

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
```

### 7. Iniciar el frontend

Ejecutar:

```powershell
pnpm dev
```

Abrir la aplicación en:

http://localhost:5173

Para utilizar todas las funciones, mantener en ejecución tanto el backend como el frontend.

## Usuario administrador inicial

El seed crea la siguiente cuenta:

| Campo | Valor |
|---|---|
| Usuario | `admin` |
| Contraseña | `Admin1234!` |
| Email | `admin@foodstore.test` |
| Rol | `admin` |

Esta cuenta está destinada al desarrollo y las pruebas locales.

Los usuarios registrados desde la aplicación reciben automáticamente el rol `user`.

## Autenticación y autorización

La aplicación utiliza JWT almacenados en una cookie HttpOnly llamada `access_token`.

El frontend envía las credenciales mediante Axios y utiliza `withCredentials: true` para incluir la cookie en las peticiones.

El token no se almacena en `localStorage` ni es accesible desde JavaScript.

El backend valida la autenticación y los permisos de cada operación protegida. Los administradores acceden a las funciones de gestión y los clientes solamente pueden consultar y cancelar sus propios pedidos según las reglas del sistema.

## Reglas de negocio de pedidos

- Un pedido debe contener al menos un producto y no puede repetir productos entre sus líneas.
- Los productos deben estar activos, disponibles y contar con stock suficiente.
- Al crear un pedido, el stock se descuenta dentro de la misma transacción.
- Cada detalle conserva el nombre y el precio del producto al momento de la compra.
- El total y los detalles del pedido no se modifican después de su creación.
- Los clientes solamente pueden cancelar sus pedidos en estado `PENDIENTE`.
- Los administradores pueden avanzar o cancelar pedidos respetando las transiciones permitidas.
- Al cancelar un pedido, se restituye el stock en la misma transacción.
- Los pedidos entregados y cancelados no admiten nuevas transiciones.

Las formas de pago disponibles son `EFECTIVO` y `TRANSFERENCIA`. El sistema no incluye procesamiento de pagos en línea.

## Verificaciones del proyecto

Desde `frontend`, ejecutar:

```powershell
pnpm build
pnpm lint
```

El primer comando verifica los tipos de TypeScript y genera la compilación de producción. El segundo ejecuta ESLint.

Para comprobar los endpoints del backend se puede utilizar la documentación interactiva disponible en:

http://localhost:8000/docs

## Variables de entorno

### Backend

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `SECRET_KEY` | Clave utilizada para firmar los JWT |
| `ALGORITHM` | Algoritmo de firma, `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token en minutos |
| `FRONTEND_ORIGIN` | Origen autorizado para CORS |

### Frontend

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API REST |

Los ejemplos completos se encuentran en `backend/.env.example` y `frontend/.env.example`.

## Video de demostración

[Ver demostración de Food Store en YouTube](https://youtu.be/t80026K642g)