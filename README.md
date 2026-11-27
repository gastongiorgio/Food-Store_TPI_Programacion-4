
# 🍔 Food Store

<p align="center">
  <strong>Plataforma Full Stack para la gestión de pedidos de comida</strong><br>
  Trabajo Práctico Integrador de <strong>Programación IV · Tecnicatura Universitaria en Programación (UTN)</strong>.
</p>


<p align="center">
  <img alt="Estado: Finalizado" src="https://img.shields.io/badge/Estado-Finalizado-22C55E?style=for-the-badge&labelColor=15803D" />
  <img alt="UTN Programación IV" src="https://img.shields.io/badge/UTN-Programaci%C3%B3n_IV-3B82F6?style=for-the-badge&labelColor=1D4ED8" />
  <img alt="Full Stack Web App" src="https://img.shields.io/badge/Full_Stack-Web_App-14B8A6?style=for-the-badge&labelColor=0F766E" />
</p>


<p align="center">
  <img alt="Python 3.13" src="https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&labelColor=285A85&logo=python&logoColor=white" />
  <img alt="FastAPI 0.115" src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&labelColor=00695C&logo=fastapi&logoColor=white" />
  <img alt="SQLModel 0.0.22" src="https://img.shields.io/badge/SQLModel-0.0.22-7C3AED?style=for-the-badge&labelColor=5B21B6" />
  <img alt="PostgreSQL 15+" src="https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?style=for-the-badge&labelColor=294BA6&logo=postgresql&logoColor=white" />
  <img alt="React 19" src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&labelColor=08759B&logo=react&logoColor=white" />
  <img alt="TypeScript 6" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&labelColor=235A91&logo=typescript&logoColor=white" />
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&labelColor=474DC4&logo=vite&logoColor=white" />
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&labelColor=087F96&logo=tailwindcss&logoColor=white" />
  <img alt="TanStack Query 5" src="https://img.shields.io/badge/TanStack_Query-5-EF4444?style=for-the-badge&labelColor=B91C1C&logo=reactquery&logoColor=white" />
  <img alt="Zustand 5" src="https://img.shields.io/badge/Zustand-5-C05621?style=for-the-badge&labelColor=8B3B16" />
  <img alt="JWT HttpOnly" src="https://img.shields.io/badge/JWT-HttpOnly_Cookie-D97706?style=for-the-badge&labelColor=9A4D05&logo=jsonwebtokens&logoColor=white" />
</p>


---

## 📑 Contenido

- [📖 Descripción](#descripcion)
- [📸 Capturas de Pantalla](#capturas)
- [✨ Características principales](#caracteristicas)
- [🏗️ Arquitectura](#arquitectura)
- [🧰 Stack tecnológico](#stack)
- [📂 Estructura del proyecto](#estructura)
- [✅ Conceptos implementados](#conceptos)
- [🗺️ Modelo de dominio](#modelo)
- [📡 Referencia de la API](#api)
- [🚀 Instalación y ejecución](#instalacion)
- [🔐 Usuario administrador inicial](#admin)
- [🧪 Verificaciones](#verificaciones)
- [🧠 Aprendizajes](#aprendizajes)
- [👨‍💻 Autor](#autor)

<a id="descripcion"></a>

## 📖 Descripción

**Food Store** es una aplicación web para un negocio de comidas, desarrollada como Trabajo Práctico Integrador de **Programación IV** de la UTN.

La plataforma permite a los clientes explorar el catálogo, gestionar un carrito persistente y confirmar pedidos. Desde un panel separado, los administradores pueden gestionar el catálogo, el inventario, los usuarios y el ciclo de vida de los pedidos.

El proyecto está dividido en dos aplicaciones independientes: una **API REST con FastAPI y SQLModel**, conectada a **PostgreSQL**, y una interfaz con **React y TypeScript**. La lógica de negocio del backend utiliza los patrones **Repository** y **Unit of Work** para mantener operaciones transaccionales coherentes.

<a id="capturas"></a>

## 📸 Capturas de Pantalla

### 🛍️ Experiencia del cliente

| Catálogo de productos | Carrito de compras |
|:---------------------:|:------------------:|
| ![Catálogo de productos](./assets/screenshots/catalogo.png) | ![Carrito de compras](./assets/screenshots/carrito.png) |

### 🔐 Autenticación y panel administrativo

| Inicio de sesión | Resumen administrativo |
|:----------------:|:----------------------:|
| ![Inicio de sesión](./assets/screenshots/login.png) | ![Dashboard administrativo](./assets/screenshots/dashboard.png) |

### ⚙️ Gestión del catálogo

| Administración de categorías | Administración de productos |
|:----------------------------:|:---------------------------:|
| ![Gestión de categorías](./assets/screenshots/categorias.png) | ![Gestión de productos](./assets/screenshots/productos.png) |

### 📦 Gestión del negocio

| Administración de pedidos | Administración de usuarios |
|:-------------------------:|:--------------------------:|
| ![Gestión de pedidos](./assets/screenshots/pedidos.png) | ![Gestión de usuarios](./assets/screenshots/usuarios.png) |

<a id="caracteristicas"></a>

## ✨ Características principales

### 🛒 Portal del cliente

- Registro e inicio de sesión.
- Catálogo con **búsqueda**, filtro por categoría y paginación desde el servidor.
- Indicadores de carga (*skeletons*), estados vacíos y manejo de errores.
- Carrito de compras persistente con **Zustand**.
- Checkout con dirección, forma de pago y notas opcionales.
- Historial y detalle de pedidos propios.
- Cancelación de pedidos mientras estén pendientes.

### ⚙️ Panel administrativo

- Resumen de pedidos por estado, actividad diaria e ingresos de pedidos entregados.
- Alta, modificación y baja lógica de categorías y productos.
- Gestión independiente del **stock** y la disponibilidad.
- Listado de pedidos, filtros y cambios de estado válidos.
- Listado, activación y desactivación de usuarios.
- Tablas con **TanStack Table** y formularios con **TanStack Form**.

### 🔐 Seguridad y reglas de negocio

- Autenticación mediante **JWT en cookie HttpOnly**.
- Autorización basada en roles: `user` y `admin` (**RBAC**).
- Contraseñas protegidas con **Passlib y bcrypt**.
- Rutas protegidas en React y validación de permisos en FastAPI.
- Creación de pedidos con descuento de stock dentro de una transacción.
- Cancelación con **restitución transaccional del inventario**.
- Copia del nombre y precio al crear cada detalle, para conservar el valor histórico.
- Validación de transiciones entre estados de los pedidos.

<a id="arquitectura"></a>

## 🏗️ Arquitectura

La solución sigue un modelo **cliente-servidor**, con responsabilidades separadas entre la interfaz, la API y la persistencia.

```text
                     FRONTEND
          React 19 + TypeScript + Vite
                       │
        TanStack Query · Zustand · Axios
                       │
            HTTP + cookie HttpOnly
                       ▼
                     BACKEND
               FastAPI · API REST
                       │
           Autenticación JWT + RBAC
                       │
                     Router
                       │
                 Service (RN)
                       │
                Unit of Work
                       │
                   Repository
                       │
                    SQLModel
                       ▼
                   PostgreSQL
```

En el backend, los **Routers** exponen los endpoints, los **Services** aplican las reglas de negocio y los **Repositories** encapsulan el acceso a los datos. El **Unit of Work** coordina el `commit` o `rollback` de cada transacción.

En el frontend, **TanStack Query** gestiona los datos del servidor y la invalidación de consultas; **Zustand** mantiene el estado de sesión y del carrito; **Axios** centraliza las peticiones y el manejo de sesiones inválidas.

<a id="stack"></a>

## 🧰 Stack tecnológico

| Capa | Tecnologías |
|---|---|
| **Frontend** | React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 |
| **Formularios y tablas** | TanStack Form · TanStack Table |
| **Datos y estado** | TanStack Query · Zustand · React Router |
| **Cliente HTTP** | Axios (`withCredentials`) |
| **Backend** | Python 3.11–3.13 · FastAPI · Pydantic |
| **Persistencia** | SQLModel · PostgreSQL · psycopg2 |
| **Seguridad** | JWT · cookies HttpOnly · Passlib · bcrypt · RBAC |
| **Documentación** | OpenAPI · Swagger UI · ReDoc |
| **Herramientas** | pnpm · pip · Git · GitHub |

<a id="estructura"></a>

## 📂 Estructura del proyecto

```text
Food-Store_TPI_Programacion-4/
├── backend/
│   ├── app/
│   │   ├── core/                # Configuración, seguridad y componentes compartidos
│   │   ├── db/                  # Seed inicial
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── usuarios/
│   │   │   ├── categorias/
│   │   │   ├── productos/
│   │   │   └── pedidos/
│   │   └── main.py              # Aplicación FastAPI
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── features/            # Funcionalidades por dominio
│   │   ├── routes/              # Rutas y protección por rol
│   │   ├── shared/              # Cliente HTTP, componentes y utilidades
│   │   └── store/               # Estado global con Zustand
│   ├── .env.example
│   ├── package.json
│   └── pnpm-lock.yaml
├── assets/
│   └── screenshots/             # Capturas de la interfaz
├── .gitignore
└── README.md
```

<a id="conceptos"></a>

## ✅ Conceptos implementados

- **Arquitectura en capas** y módulos organizados por dominio.
- **Repository Pattern**, con repositorio base genérico.
- **Unit of Work**, manejo de sesiones y transacciones.
- **Inyección de dependencias** con FastAPI.
- **API REST** con schemas de entrada y salida.
- **Validaciones** con Pydantic y códigos HTTP adecuados.
- **JWT + RBAC**, con cookies HttpOnly y permisos en el backend.
- **Soft Delete** para categorías y productos.
- **Máquina de estados** para el ciclo de vida del pedido.
- **Persistencia de estado** con Zustand `persist`.
- **Server state** con TanStack Query, `useMutation` e invalidación.
- **Formularios tipados** con TanStack Form.
- **Tablas administrativas** con TanStack Table.
- **TypeScript en modo estricto**.

<a id="modelo"></a>

## 🗺️ Modelo de dominio

El sistema utiliza **cinco entidades principales**: `Usuario`, `Categoria`, `Producto`, `Pedido` y `DetallePedido`.

```mermaid
classDiagram
    direction LR
    Usuario "1" --> "0..*" Pedido : realiza
    Categoria "1" --> "0..*" Producto : agrupa
    Pedido "1" --> "1..*" DetallePedido : contiene
    Producto "1" --> "0..*" DetallePedido : referenciado en
```

Los detalles de cada pedido conservan una copia del **nombre** y el **precio unitario** del producto al momento de comprarlo. Por eso, una modificación posterior del catálogo no cambia el importe histórico del pedido.

### Estados del pedido

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE
    PENDIENTE --> EN_PREPARACION
    PENDIENTE --> CANCELADO
    EN_PREPARACION --> ENTREGADO
    EN_PREPARACION --> CANCELADO
```

Los estados **ENTREGADO** y **CANCELADO** son terminales. Al cancelar un pedido, el stock se repone dentro de la misma transacción que actualiza su estado.

<a id="api"></a>

## 📡 Referencia de la API

Los endpoints utilizan el prefijo **`/api/v1`**. La documentación interactiva completa está disponible en [Swagger UI](http://localhost:8000/docs) y [ReDoc](http://localhost:8000/redoc) cuando el backend está en ejecución.

| Método | Endpoint | Función | Acceso |
|---|---|---|---|
| `POST` | `/auth/register` | Registrar cliente | Público |
| `POST` | `/auth/token` | Iniciar sesión y establecer cookie JWT | Público |
| `GET` | `/auth/me` | Consultar sesión | Autenticado |
| `POST` | `/auth/logout` | Cerrar sesión | Público |
| `GET` | `/categorias` | Listar categorías activas | Público |
| `POST / PUT / DELETE` | `/categorias` y `/categorias/{id}` | Gestionar categorías | Admin |
| `GET` | `/productos` | Buscar, filtrar y paginar productos | Público |
| `POST / PUT / DELETE` | `/productos` y `/productos/{id}` | Gestionar productos | Admin |
| `PATCH` | `/productos/{id}/stock` | Actualizar stock y disponibilidad | Admin |
| `POST` | `/pedidos` | Confirmar una compra | Autenticado |
| `GET` | `/pedidos` | Listar pedidos propios o todos según el rol | Autenticado |
| `GET` | `/pedidos/{id}` | Consultar un pedido autorizado | Autenticado |
| `PATCH` | `/pedidos/{id}/cancelar` | Cancelar un pedido propio pendiente | Cliente propietario |
| `PATCH` | `/pedidos/{id}/estado` | Cambiar el estado del pedido | Admin |
| `GET` | `/pedidos/resumen` | Obtener indicadores administrativos | Admin |
| `GET` | `/admin/usuarios` | Listar usuarios | Admin |
| `POST` | `/admin/usuarios/{id}/activar` | Activar cuenta | Admin |
| `POST` | `/admin/usuarios/{id}/desactivar` | Desactivar cuenta | Admin |

<a id="instalacion"></a>

## 🚀 Instalación y ejecución

Los comandos siguientes están pensados para **PowerShell en Windows**. El backend y el frontend se ejecutan por separado.

### Requisitos

- **Git**.
- **Python 3.11, 3.12 o 3.13**.
- **PostgreSQL 15 o superior**.
- **Node.js** compatible con Vite 8 (se utilizó Node.js 24 durante el desarrollo).
- **pnpm 9 o superior**, con una versión compatible con Node.js.

### 1. Clonar el repositorio

```powershell
git clone https://github.com/gastongiorgio/Food-Store_TPI_Programacion-4.git
cd Food-Store_TPI_Programacion-4
```

### 2. Preparar PostgreSQL

Crear una base de datos llamada **`foodstore_tpi`**, por ejemplo desde pgAdmin o desde una consola SQL conectada al servidor:

```sql
CREATE DATABASE foodstore_tpi;
```

### 3. Instalar y configurar el backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Editar **`backend/.env`** con las credenciales locales de PostgreSQL y una clave JWT propia:

```dotenv
DATABASE_URL=postgresql+psycopg2://postgres:TU_CONTRASENA@localhost:5432/foodstore_tpi
SECRET_KEY=REEMPLAZAR_POR_UNA_CLAVE_ALEATORIA_SEGURA
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_ORIGIN=http://localhost:5173
```

Para generar una clave aleatoria:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Reemplazar `SECRET_KEY` por la clave generada. **No subir los archivos `.env` al repositorio.**

### 4. Cargar datos iniciales y ejecutar la API

Desde `backend`, con el entorno virtual activado:

```powershell
python -m app.db.seed
uvicorn app.main:app --reload
```

El **seed es idempotente**: crea un administrador, tres categorías y ocho productos sin duplicar los registros iniciales al ejecutarse nuevamente.

| Servicio | URL |
|---|---|
| API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

### 5. Instalar y ejecutar el frontend

Abrir **otra terminal** en la raíz del proyecto:

```powershell
cd frontend
pnpm install --frozen-lockfile
Copy-Item .env.example .env
pnpm dev
```

Verificar que **`frontend/.env`** contenga:

```dotenv
VITE_API_URL=http://localhost:8000/api/v1
```

Abrir la aplicación en **http://localhost:5173**. Mantener ambos servidores en ejecución.

<a id="admin"></a>

## 🔐 Usuario administrador inicial

El seed incluye una cuenta de prueba para acceder al panel administrativo:

| Campo | Valor |
|---|---|
| Usuario | `admin` |
| Contraseña | `Admin1234!` |
| Email | `admin@foodstore.test` |
| Rol | `admin` |

> **Importante:** estas credenciales son exclusivamente para desarrollo y demostraciones locales. No deben utilizarse en un despliegue público.

Los usuarios creados desde la pantalla de registro reciben automáticamente el rol `user`.

<a id="verificaciones"></a>

## 🧪 Verificaciones

Con el frontend configurado, desde la carpeta `frontend`:

```powershell
pnpm build
pnpm lint
```

`pnpm build` comprueba los tipos de TypeScript y genera la compilación de producción. `pnpm lint` ejecuta ESLint.

Para revisar los contratos HTTP y probar los endpoints, utilizar [Swagger UI](http://localhost:8000/docs).

<a id="aprendizajes"></a>

## 🧠 Aprendizajes y habilidades adquiridas

Este proyecto me permitió aplicar conceptos de desarrollo **Full Stack**, especialmente en la coordinación entre reglas de negocio, persistencia, seguridad y experiencia de usuario.

- **Backend transaccional:** diseño de Services, Repositories y Unit of Work para crear y cancelar pedidos sin inconsistencias de stock.
- **Seguridad:** autenticación JWT mediante cookies HttpOnly, validación de sesión y autorización por roles.
- **Modelado de datos:** relaciones entre entidades, baja lógica y conservación de datos históricos en los detalles de pedidos.
- **Frontend con React:** gestión diferenciada del estado del servidor con TanStack Query y del estado local con Zustand.
- **Integración y validación:** consumo de API REST con Axios, formularios tipados, gestión de errores y rutas protegidas.

<a id="autor"></a>

## 👨‍💻 Autor

**Gastón Armando Giorgio**  
Estudiante de la Tecnicatura Universitaria en Programación (UTN).  
Mendoza, Argentina.

**Repositorio:** [Food Store · Programación IV](https://github.com/gastongiorgio/Food-Store_TPI_Programacion-4)

---

<div align="center">

⭐ **Si este proyecto te resultó interesante o útil, podés dejarle una estrella al repositorio.**

</div>
