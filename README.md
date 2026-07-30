# NaniRepair - MERN Repair Service Tracker

Aplicación web premium para la gestión y rastreo de reparaciones de dispositivos tecnológicos (consolas de videojuegos, controles, monitores, laptops, computadoras de escritorio y celulares). 

Construido utilizando la arquitectura **MERN** (MongoDB, Express, React, Node.js) y optimizado para ejecutarse localmente y ser desplegado en **Vercel** de manera unificada.

---

## 🛠️ Tecnologías Empleadas

- **Frontend**: React (Vite), Iconos de Lucide-React.
- **Backend / API**: Express y Node.js configurados como Serverless Functions de Vercel en la carpeta `/api`.
- **Base de Datos**: MongoDB Atlas (Mongoose).
- **Estilos**: Sistema de diseño moderno y responsivo con Vanilla CSS, tema oscuro y efectos glassmorphism.

---

## 📂 Estructura del Proyecto

```text
NaniRepair/
├── api/                   # Backend Express (Vercel Serverless Functions)
│   ├── models/            # Esquemas de Mongoose (Repair)
│   ├── routes/            # Rutas de API (Repairs CRUD)
│   └── index.js           # Entrada del servidor y conexión a DB
├── src/                   # Frontend React (Vite)
│   ├── pages/             # Vistas (Home, Track, Admin)
│   ├── App.jsx            # Enrutador principal y componentes comunes
│   ├── index.css          # Diseño CSS premium y variables globales
│   └── main.jsx           # Entrada de React
├── .env                   # Variables de entorno (Locales)
├── vercel.json            # Configuración de despliegue en Vercel
├── vite.config.js         # Proxy para desarrollo local (/api)
└── package.json           # Dependencias unificadas y scripts de ejecución
```

---

## ⚙️ Configuración e Instalación Local

### 1. Requisitos Previos
- Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
- Cuenta en MongoDB Atlas o servidor local de Mongo (la cadena de conexión ya está preconfigurada).

### 2. Clonar e Instalar Dependencias
Clona el repositorio e instala las dependencias de NPM en la raíz del proyecto:
```bash
npm install
```

### 3. Variables de Entorno
El archivo `.env` en la raíz ya cuenta con la cadena de conexión suministrada:
```env
MONGODB_URI=mongodb+srv://thejeanpollo_db_user:oneforallfullclow100@cluster0.av2jhdp.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
```

### 4. Iniciar en Modo de Desarrollo
Ejecuta el siguiente comando para iniciar el cliente React (Vite en puerto 5173) y el servidor backend (Express en puerto 5000) de manera simultánea mediante `concurrently`:
```bash
npm run dev
```
Abre en tu navegador: [http://localhost:5173](http://localhost:5173).

---

## 🚀 Despliegue en Vercel y GitHub

### Subir a GitHub
Para conectar y subir al repositorio configurado por el usuario:
```bash
git init
git add .
git commit -m "Initial commit - NaniRepair MERN stack implementation"
git branch -M main
git remote add origin https://github.com/JeanpollaTI/nanirepair.git
git push -u origin main
```

### Despliegue en Vercel
1. Conecta tu repositorio de GitHub `nanirepair` a tu panel de Vercel.
2. Vercel detectará automáticamente que es un proyecto **Vite**.
3. En la sección **Environment Variables**, añade la siguiente variable:
   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://thejeanpollo_db_user:oneforallfullclow100@cluster0.av2jhdp.mongodb.net/?appName=Cluster0`
4. Presiona **Deploy**. Vercel se encargará de compilar el frontend e implementar el servidor Express como funciones serverless bajo la ruta `/api/*` configurada por `vercel.json`.
