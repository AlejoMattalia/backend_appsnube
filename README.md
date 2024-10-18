# AppNube Backend

Este repositorio contiene el backend del challenge de AppNube, que permite a los usuarios gestionar productos, realizar compras y administrar órdenes. El sistema incluye funcionalidades para registrar y autenticar usuarios, gestionar productos y marcas, y realizar órdenes de compra. Además, los administradores pueden gestionar las marcas, productos y visualizar las órdenes realizadas.



## URL del Backend en AWS

El backend está desplegado en un servidor EC2 de AWS. Puedes acceder a él en la siguiente URL:

- http://ec2-18-228-24-176.sa-east-1.compute.amazonaws.com/

## Tecnologías y Librerías Utilizadas

- **Express**: Framework para crear el servidor y manejar las rutas.
- **Prisma**: ORM (Object-Relational Mapping) para la gestión de la base de datos y facilitar las consultas y operaciones.
- **bcrypt**: Para la encriptación de contraseñas.
- **cors**: Para habilitar CORS y permitir el acceso al backend desde diferentes orígenes.
- **dotenv**: Para cargar variables de entorno desde un archivo `.env`.
- **jwt-simple**: Para la creación y verificación de tokens JWT, utilizados en la autenticación de usuarios.
- **moment**: Para manejar y formatear fechas de manera sencilla.
- **validator**: Para la validación de entradas, como correos electrónicos y otros datos de formularios.
- **nodemon** (devDependency): Herramienta de desarrollo para reiniciar el servidor automáticamente cuando hay cambios en el código.

## Base de Datos
La base de datos utilizada fue SQLITE

## ORM (Prisma)

El backend utiliza Prisma como ORM para facilitar la conexión con la base de datos. Prisma permite manejar las consultas y operaciones en la base de datos de manera eficiente y con un enfoque orientado a objetos. Se utiliza para gestionar usuarios, productos, marcas y órdenes.

Para configurar Prisma:
1. Instala el cliente con `npm install @prisma/client`.
2. Define el esquema de tu base de datos en el archivo `prisma/schema.prisma`.
3. Ejecuta las migraciones con `npx prisma migrate dev` para crear las tablas en la base de datos.

## Rutas Principales

Las siguientes rutas están disponibles en el backend:

- `/api/auth`: Rutas de autenticación (registro y login).
- `/api/brand`: Rutas para la gestión de marcas (solo admins).
- `/api/product`: Rutas para la gestión de productos (usuarios y admins).
- `/api/order`: Rutas para la gestión de órdenes de compra.


## Funcionalidades del Backend

### 1. **Usuarios**

Los usuarios pueden registrarse y autenticarse para realizar compras. Las rutas disponibles son:
- `POST /api/auth/register`: Registra un nuevo usuario.
- `POST /api/auth/login`: Autentica un usuario y genera un token JWT.

### 2. **Marcas (Solo Administradores)**

Los administradores tienen acceso completo para gestionar las marcas de productos:
- `POST /api/brand/create_brand`: Crear una nueva marca.
- `GET /api/brand/get_brands`: Obtener una lista de todas las marcas disponibles.
- `PATCH /api/brand/update_brand/:id`: Actualizar una marca específica.
- `DELETE /api/brand/delete_brand/:id`: Eliminar una marca.

### 3. **Productos**

Los usuarios y administradores pueden acceder a los productos. Los administradores pueden crear, actualizar o eliminar productos:
- `POST /api/product/create_product`: Crear un nuevo producto (solo admins).
- `GET /api/product/one_product/:id`: Obtener los detalles de un producto específico.
- `GET /api/product/get_products/:page?`: Obtener una lista de todos los productos disponibles.
- `PATCH /api/product/update_product/:id`: Actualizar un producto específico (solo admins).
- `DELETE /api/product/delete_product/:id`: Eliminar un producto (solo admins).

### 4. **Órdenes**

Los usuarios pueden crear órdenes de compra al agregar productos a su carrito. Los administradores pueden ver todas las órdenes:
- `POST /api/order/create_order`: Crear una nueva orden de compra.
- `GET /api/order/list_orders`: Obtener una lista de todas las órdenes (solo admins).


## Cómo Levantar el Proyecto

### Requisitos Previos

Asegúrate de tener instalado:
- Node.js
- npm (gestor de paquetes de Node.js)

### Pasos para Ejecutar el Proyecto en Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/AlejoMattalia/backend_appsnube.git

2. **Navegar al directorio del proyecto**:
   ```bash
   cd backend_appsnube/

3. **Instalar las dependencias:**:
   ```bash
   npm install

4. **Configurar las variables de entorno** <br><br>
   Crea un archivo .env en la raíz del proyecto con la siguiente variable:

   ```bash
   DATABASE_URL="file:./dev.db"

5. **Iniciar el servidor**
   ```bash
   npm run dev

6. **El servidor estará corriendo en el puerto 4000 por defecto.**   





    