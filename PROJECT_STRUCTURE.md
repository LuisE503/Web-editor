# Estructura del Proyecto HTMLKit Hub

```
HTMLKit Hub/
│
├── 📄 index.html                    # Página principal - Galería de componentes
├── 📄 playground.html               # Editor interactivo de código
├── 📄 README.md                     # Documentación principal del proyecto
├── 📄 QUICKSTART.md                 # Guía de inicio rápido
├── 📄 CONTRIBUTING.md               # Guía para contribuidores
├── 📄 LICENSE                       # Licencia MIT
├── 📄 package.json                  # Configuración npm (opcional)
├── 📄 .gitignore                    # Archivos ignorados por Git
├── 📄 .eslintrc.json               # Configuración de ESLint
├── 📄 .prettierrc                   # Configuración de Prettier
│
├── 📁 components/                   # Web Components
│   ├── 📄 ph-button.js             # Componente botón con Shadow DOM
│   ├── 📄 ph-modal.js              # Componente modal accesible
│   └── 📄 ph-card.js               # Componente tarjeta con slots
│
├── 📁 scripts/                      # JavaScript principal
│   ├── 📄 main.js                  # Lógica de la aplicación y UI
│   └── 📄 storage.js               # API de IndexedDB/localStorage
│
├── 📁 styles/                       # Estilos CSS
│   ├── 📄 base.css                 # Estilos base y variables
│   └── 📄 themes.css               # Sistema de temas claro/oscuro
│
├── 📁 examples/                     # Templates y ejemplos
│   └── 📄 templates.json           # 5 snippets de ejemplo predefinidos
│
├── 📁 tests/                        # Testing y QA
│   └── 📄 accessibility-checklist.md  # Checklist completo de accesibilidad
│
└── 📁 .github/                      # GitHub específico
    └── 📁 workflows/
        └── 📄 gh-pages.yml         # CI/CD para GitHub Pages
```

## 📋 Descripción de Archivos

### 🌐 Páginas HTML

**index.html** (Galería)
- Página principal con todos los componentes
- Sistema de búsqueda
- Demos interactivos de cada componente
- Enlaces a documentación
- Toggle de tema integrado

**playground.html** (Editor)
- Editor de código con 3 pestañas (HTML/CSS/JS)
- Integración con CodeMirror
- Preview en iframe sandbox
- Consola integrada que captura logs y errores
- Sistema de guardado/carga de snippets
- Templates predefinidos

### 🧩 Componentes (components/)

**ph-button.js** (~200 líneas)
- Botón personalizable con Shadow DOM
- 4 variantes: primary, secondary, success, danger
- 3 tamaños: small, medium, large
- Estado disabled
- Atributos ARIA completos
- Animación ripple al hacer click
- Navegación por teclado (Enter, Space)

**ph-modal.js** (~300 líneas)
- Modal accesible con Shadow DOM
- Gestión automática de foco
- Focus trap (Tab no sale del modal)
- Cierre con Escape y backdrop
- Animaciones suaves (fadeIn, slideIn)
- Atributos ARIA completos
- Restauración de foco al cerrar

**ph-card.js** (~200 líneas)
- Tarjeta flexible con Shadow DOM
- 3 slots: header, body, footer
- 3 variantes: flat, elevated, outlined
- Estado clickeable opcional
- Responsive design
- Eventos personalizados

### 📜 Scripts (scripts/)

**storage.js** (~400 líneas)
- API completa de almacenamiento
- IndexedDB como principal
- localStorage como fallback
- CRUD completo de snippets
- Exportar/importar snippets
- Manejo de errores robusto

**main.js** (~500 líneas)
- Inicialización de la app
- Gestión de temas (claro/oscuro)
- Carga dinámica de componentes
- Búsqueda en galería
- Inicialización del playground
- Integración con CodeMirror
- runPreview() con sandbox seguro
- Captura de console.log y errores
- Auto-save cada 30 segundos
- Atajos de teclado
- Sistema de notificaciones

### 🎨 Estilos (styles/)

**base.css** (~600 líneas)
- Reset CSS moderno
- Variables CSS globales
- Sistema de espaciado
- Tipografía responsive
- Componentes base (card, btn, alert)
- Utilidades (flex, gap, spacing)
- Animaciones (fadeIn, slideIn, spin)
- Media queries
- Accesibilidad (focus-visible, reduced-motion)

**themes.css** (~400 líneas)
- Variables para tema claro
- Variables para tema oscuro
- Transiciones suaves entre temas
- Respeta prefers-color-scheme
- Colores con contraste WCAG AA
- Estilos del toggle de tema
- Scrollbar personalizado
- Selección de texto personalizada

### 📚 Ejemplos (examples/)

**templates.json** (5 templates completos)
1. Hello World Básico - Introducción
2. Contador Interactivo - Estado y eventos
3. Lista de Tareas - CRUD básico
4. Tarjetas con Web Components - Uso de componentes
5. Animación y Transiciones - Efectos CSS

Cada template incluye:
- HTML estructurado
- CSS con animaciones
- JavaScript funcional
- Comentarios explicativos
- Console.log para debugging

### ✅ Testing (tests/)

**accessibility-checklist.md** (~500 líneas)
- Tests generales de accesibilidad
- Tests específicos por componente
- Tests de navegación por teclado
- Tests de focus management
- Tests de contraste y colores
- Tests con lectores de pantalla
- Herramientas recomendadas
- Proceso de testing completo
- Criterios de éxito WCAG 2.1

### 🚀 CI/CD (.github/workflows/)

**gh-pages.yml**
- Lint de JavaScript con ESLint
- Validación de archivos HTML
- Validación de componentes y estilos
- Deploy automático a GitHub Pages
- Verificación post-deploy
- Notificaciones de éxito/error

### 📦 Configuración

**package.json**
- Scripts útiles (start, dev, lint, format)
- Metadata del proyecto
- DevDependencies opcionales

**.eslintrc.json**
- Configuración de linting
- Reglas de estilo de código
- Globals definidos

**.prettierrc**
- Formateo consistente
- Configuración de indentación
- Reglas de comillas y punto y coma

**.gitignore**
- node_modules/
- Archivos del editor
- Archivos temporales
- Logs y cache

## 📊 Estadísticas del Proyecto

- **Total de archivos**: 20+
- **Líneas de código**: ~3000+
- **Web Components**: 3
- **Templates de ejemplo**: 5
- **Páginas HTML**: 2
- **Archivos CSS**: 2
- **Archivos JS**: 5
- **Archivos de documentación**: 5

## 🎯 Características Principales

### ✨ Funcionalidades
- ✅ Galería de componentes interactiva
- ✅ Playground con editor de código en vivo
- ✅ Sistema de guardado/carga con IndexedDB
- ✅ Temas claro y oscuro
- ✅ Templates de ejemplo predefinidos
- ✅ Consola integrada con captura de logs
- ✅ Preview en iframe sandbox
- ✅ Atajos de teclado
- ✅ Auto-save
- ✅ Búsqueda de componentes

### ♿ Accesibilidad
- ✅ ARIA labels completos
- ✅ Navegación 100% por teclado
- ✅ Focus management apropiado
- ✅ Contraste WCAG 2.1 AA
- ✅ Compatible con lectores de pantalla
- ✅ Responsive desde 320px
- ✅ Respeta prefers-reduced-motion

### 🔒 Seguridad
- ✅ Iframe sandbox
- ✅ Content Security Policy
- ✅ Timeouts para prevenir loops
- ✅ Validación de inputs
- ✅ Sanitización de datos

### 🎨 UX/UI
- ✅ Diseño moderno y limpio
- ✅ Animaciones suaves
- ✅ Feedback visual claro
- ✅ Loading states
- ✅ Mensajes de error descriptivos
- ✅ Notificaciones toast
- ✅ Responsive design

## 🚀 Tecnologías Utilizadas

- **HTML5**: Semántico y accesible
- **CSS3**: Variables, Grid, Flexbox, Animaciones
- **JavaScript ES6+**: Módulos, async/await, Promises
- **Web Components**: Custom Elements, Shadow DOM
- **IndexedDB**: Almacenamiento local
- **CodeMirror**: Editor de código (CDN)
- **GitHub Actions**: CI/CD
- **GitHub Pages**: Hosting

## 📈 Compatibilidad

### Navegadores Soportados
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Dispositivos
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablets
- ✅ Móviles (iOS, Android)

## 🎓 Casos de Uso

1. **Aprendizaje**: Aprender Web Components sin frameworks
2. **Prototipado**: Crear prototipos rápidos
3. **Testing**: Probar snippets de código
4. **Documentación**: Documentar componentes
5. **Portfolio**: Mostrar habilidades frontend
6. **Educación**: Enseñar HTML/CSS/JS
7. **Biblioteca**: Reutilizar componentes en proyectos

---

**Creado con ❤️ usando solo HTML, CSS y JavaScript puro**
