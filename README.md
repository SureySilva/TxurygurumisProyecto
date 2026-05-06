![Angular](https://img.shields.io/badge/Angular-19-red)
![Firebase](https://img.shields.io/badge/Firebase-Backend-orange)
![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey)

# Txurygurumis

Txurygurumis es una aplicación web desarrollada como proyecto final del ciclo de Desarrollo de Aplicaciones Web (DAW).

La aplicación combina funcionalidades de comercio electrónico con la publicación de contenido relacionado con el crochet y los amigurumis, permitiendo tanto la venta de productos como la gestión de patrones.

---

# Características principales

## Usuarios
- Registro e inicio de sesión
- Recuperación de contraseña
- Gestión de perfil
- Gestión de pedidos

## Tienda
- Visualización de productos
- Carrito de compra persistente
- Gestión de pedidos
- Pago mediante PayPal Sandbox

## Administración
- Gestión de productos y galería
- Gestión de patrones mediante Quill Editor
- Gestión de pedidos
- Cambio de estado de pedidos

## Backend
- Firebase Authentication
- Firestore
- Cloud Functions
- Firebase Hosting

---

# Tecnologías utilizadas

## Frontend
- Angular
- Bootstrap

## Backend
- Firebase
  - Firestore
  - Authentication
  - Cloud Functions
  - Hosting

## Otros servicios
- PayPal Sandbox
- Quill Editor


---

# Instalación del proyecto

## Clonar repositorio

```bash
git clone https://github.com/SureySilva/TxurygurumisProyecto.git
```
## Instalar dependencias

```bash
npm install
```
## Ejecutar la aplicación

```bash
ng serve
```

## Ejecutar Firebase Functions

```bash
firebase emulators:start
```
---

# Despliegue

Aplicación desplegada en Firebase Hosting:

https://txurygurumis.web.app/

# Funcionalidades técnicas destacadas

- Uso de componentes standalone en Angular
- Protección de rutas mediante guards
- Actualización de datos y estados de pedidos en tiempo real mediante Firestore
- Gestión backend mediante Cloud Functions
- Sanitización de datos para mejorar la seguridad
- Arquitectura basada en servicios

# Autor

**Surey Silvia Silva Moya**

# Licencia

Este proyecto se distribuye bajo la licencia:

[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)
