# ÁGORA — News Platform

Plataforma web de noticias desarrollada con Angular que permite explorar publicaciones, consultar noticias por categoría, guardar artículos favoritos y administrar el contenido desde una interfaz de gestión.

**Aplicación publicada:** https://agora-news.netlify.app/  
**Repositorio:** https://github.com/ariannamorav/Agora-News-Platform

---

## Descripción del proyecto

ÁGORA es una plataforma digital de noticias diseñada para ofrecer una experiencia de navegación clara, organizada y adaptable. El proyecto integra una interfaz pública para consultar publicaciones y un módulo administrativo para gestionar el contenido.

La aplicación se desarrolló como una evolución del proyecto original Agora-News-Platform, incorporando Angular para estructurar la interfaz y organizar las funcionalidades en componentes, páginas y servicios.

## Funcionalidades principales

### Navegación y consulta de noticias
- Página de inicio con publicaciones destacadas.
- Listado de noticias.
- Consulta de noticias individuales mediante páginas de detalle.
- Organización de publicaciones por categorías.
- Visualización de imágenes asociadas a las noticias.

### Gestión de favoritos
- Agregar y quitar noticias de favoritos.
- Consultar las publicaciones guardadas.
- Mantener el estado de los favoritos mediante el mecanismo de almacenamiento implementado en la aplicación.

### Panel de administración
- Crear nuevas noticias.
- Consultar y editar publicaciones existentes.
- Eliminar noticias.
- Validar los campos del formulario.
- Seleccionar imágenes desde el equipo y mostrar una vista previa.
- Contar los caracteres del resumen, con un límite de 300 caracteres.
- Desplazarse automáticamente hasta el formulario al crear o editar una publicación.
- Conservar las publicaciones administradas en el almacenamiento local del navegador.

### Otras funcionalidades
- Página de contacto con validaciones de formulario.
- Diseño adaptable a diferentes tamaños de pantalla.
- Carga inicial de noticias desde un archivo JSON.
- Organización del código mediante componentes, modelos y servicios de Angular.

## Tecnologías utilizadas

- **Angular 20:** estructura de la aplicación, componentes, navegación y lógica de interfaz.
- **TypeScript:** desarrollo de la lógica de la aplicación.
- **HTML5:** estructura y contenido de las páginas.
- **CSS3:** estilos y diseño visual.
- **JSON:** datos iniciales de las noticias.
- **LocalStorage:** persistencia local de información administrada y favoritos, según la funcionalidad implementada.
- **IndexedDB:** almacenamiento local de imágenes cargadas desde el panel administrativo.
- **Git y GitHub:** control de versiones y alojamiento del código fuente.
- **Netlify:** compilación y publicación de la aplicación web.

## Estructura del proyecto

La estructura principal del frontend Angular es la siguiente:

```text
Agora-News-Platform/
├── assets/
├── css/
├── data/
├── js/
├── index.html
├── readme.md
├── ...archivos originales de la Entrega 2
└── agora-frontend/
    ├── public/
    │   ├── data/
    │   │   └── news.json
    │   └── assets/
    │       └── images/
    ├── src/
    │   └── app/
    │       ├── core/
    │       │   └── services/
    │       │       ├── news.service.ts
    │       │       └── image-storage.service.ts
    │       ├── models/
    │       │   └── news.model.ts
    │       ├── pages/
    │       │   ├── home/
    │       │   ├── news/
    │       │   ├── article-detail/
    │       │   ├── categories/
    │       │   ├── favorites/
    │       │   ├── contact/
    │       │   └── admin/
    │       ├── app.config.ts
    │       ├── app.routes.ts
    │       ├── app.html
    │       └── app.ts
    ├── package.json
    ├── package-lock.json
    └── angular.json
```

La estructura es representativa de los archivos principales del proyecto; pueden existir archivos adicionales de configuración, estilos y componentes.

## Requisitos previos

Para ejecutar el proyecto localmente, necesitas:

- Node.js compatible con Angular 20.
- npm.
- Git.
- Un editor de código, como Visual Studio Code o Antigravity IDE.

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/ariannamorav/Agora-News-Platform.git
```

### 2. Entrar en el frontend Angular

```bash
cd Agora-News-Platform/agora-frontend
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Ejecutar la aplicación

```bash
npm start
```

Abre en el navegador:

http://localhost:4200

### 5. Compilar para producción

```bash
npm run build
```

La compilación genera los archivos optimizados para producción dentro de la carpeta `dist/agora-frontend/`, incluyendo el directorio `browser` utilizado en la configuración actual de despliegue.

## Despliegue en Netlify

La aplicación está publicada mediante integración con el repositorio de GitHub.

**Sitio publicado:** https://agora-news.netlify.app/

Configuración de compilación utilizada:

| Parámetro | Valor |
|---|---|
| Repositorio | `ariannamorav/Agora-News-Platform` |
| Rama | `main` |
| Directorio base | Raíz del repositorio |
| Comando de compilación | `cd agora-frontend && npm ci && npm run build` |
| Directorio de publicación | `agora-frontend/dist/agora-frontend/browser` |

La publicación se realizó correctamente después de ajustar el comando de compilación y el directorio de publicación en Netlify.

## Persistencia de datos

La aplicación utiliza mecanismos de almacenamiento del navegador para conservar determinadas operaciones del panel administrativo y de favoritos.

- **LocalStorage:** conserva información local de las publicaciones administradas y otros datos implementados en el frontend.
- **IndexedDB:** almacena las imágenes seleccionadas desde el panel de administración.

Estos mecanismos permiten conservar información en el navegador utilizado, pero no equivalen a una base de datos centralizada. Actualmente, el proyecto no incluye un backend remoto ni sincronización automática de los datos entre dispositivos.

## Objetivos de desarrollo

El proyecto permite aplicar conceptos de desarrollo frontend, incluyendo:

- Organización de aplicaciones mediante Angular.
- Componentización y separación de responsabilidades.
- Navegación entre páginas y parámetros de ruta.
- Renderizado dinámico a partir de datos JSON.
- Formularios y validaciones.
- Operaciones CRUD para la administración de noticias.
- Gestión de archivos de imagen.
- Persistencia local de datos.
- Control de versiones con Git y GitHub.
- Compilación y despliegue de aplicaciones web.

## Autoría y repositorio

**Proyecto:** ÁGORA — News Platform  
**Repositorio:** [Agora-News-Platform en GitHub](https://github.com/ariannamorav/Agora-News-Platform)  
**Aplicación:** [Ver ÁGORA en Netlify](https://agora-news.netlify.app/)

Desarrollado como proyecto de formación en desarrollo web, con énfasis en la construcción de interfaces, gestión de contenido y publicación de aplicaciones frontend.