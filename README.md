# HTMLKit Hub

Un playground interactivo y galería de componentes Web Components puro HTML, CSS y JavaScript.

## 🚀 Características

- **Galería de Componentes**: Explora y prueba componentes reutilizables
- **Playground Interactivo**: Editor de código en vivo con preview instantáneo
- **Web Components**: Componentes nativos con Shadow DOM
- **Sistema de Temas**: Modo claro/oscuro con variables CSS
- **Almacenamiento Local**: Guarda tus snippets con IndexedDB
- **Accesibilidad**: Diseño ARIA compatible
- **Sin Frameworks**: Vanilla JavaScript puro

## 📦 Estructura del Proyecto

```
HTMLKit Hub/
├── index.html              # Galería principal de componentes
├── playground.html         # Editor interactivo de código
├── components/            # Web Components
│   ├── ph-button.js       # Componente botón
│   ├── ph-modal.js        # Componente modal
│   └── ph-card.js         # Componente tarjeta
├── scripts/              # JavaScript principal
│   ├── main.js           # Lógica de la aplicación
│   └── storage.js        # API de almacenamiento
├── styles/               # Estilos CSS
│   ├── base.css          # Estilos base
│   └── themes.css        # Sistema de temas
├── examples/             # Templates y ejemplos
│   └── templates.json    # Snippets predefinidos
├── tests/                # Tests y checklists
│   └── accessibility-checklist.md
└── .github/workflows/    # CI/CD
    └── gh-pages.yml      # Deploy automático
```

## 🛠️ Instalación y Desarrollo

### Opción 1: Abrir directamente
Simplemente abre `index.html` en tu navegador moderno.

### Opción 2: Servidor local (recomendado)
Para evitar problemas con CORS y políticas de seguridad:

**Con Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Con Node.js:**
```bash
npx http-server -p 8000
```

**Con PHP:**
```bash
php -S localhost:8000
```

Luego visita: `http://localhost:8000`

## 🎨 Componentes Disponibles

### ph-button
Botón personalizable con múltiples variantes y tamaños.
```html
<ph-button variant="primary" size="medium">Click me</ph-button>
```

**Atributos:**
- `variant`: primary, secondary, danger, success (default: primary)
- `size`: small, medium, large (default: medium)
- `disabled`: boolean

### ph-modal
Modal accesible con backdrop y gestión de foco.
```html
<ph-modal title="Mi Modal" open="true">
  <p>Contenido del modal</p>
</ph-modal>
```

**Atributos:**
- `title`: título del modal
- `open`: boolean para mostrar/ocultar
- `close-on-backdrop`: boolean (default: true)

### ph-card
Tarjeta de contenido con header, body y footer.
```html
<ph-card variant="elevated">
  <h3 slot="header">Título</h3>
  <p slot="body">Contenido</p>
  <button slot="footer">Acción</button>
</ph-card>
```

**Atributos:**
- `variant`: flat, elevated, outlined (default: flat)

## 🌐 Desplegar en GitHub Pages

1. **Push tu código a GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/htmlkit-hub.git
git push -u origin main
```

2. **Habilitar GitHub Pages:**
   - Ve a Settings → Pages
   - Source: GitHub Actions
   - El workflow `.github/workflows/gh-pages.yml` se ejecutará automáticamente

3. **Accede a tu sitio:**
   - `https://TU_USUARIO.github.io/htmlkit-hub/`

## 🔒 Seguridad

El playground utiliza:
- `<iframe sandbox>` con permisos restringidos
- Timeouts para prevenir loops infinitos
- Content Security Policy
- Sanitización de inputs

## ♿ Accesibilidad

Todos los componentes incluyen:
- Atributos ARIA apropiados
- Gestión de foco con teclado
- Navegación con Tab/Enter/Escape
- Contraste de colores WCAG 2.1 AA
- Soporte para lectores de pantalla

Ver `tests/accessibility-checklist.md` para detalles.

## 🧪 Testing

### Tests Manuales
1. Abre el playground
2. Prueba los snippets de ejemplo
3. Verifica que el preview funcione correctamente
4. Prueba guardar y cargar snippets

### Accesibilidad
- Navega usando solo el teclado (Tab, Enter, Escape)
- Prueba con un lector de pantalla (NVDA, JAWS, VoiceOver)
- Verifica contraste con herramientas como axe DevTools

## 📝 API de Almacenamiento

```javascript
// Guardar snippet
await storage.saveSnippet({
  name: 'Mi Snippet',
  html: '<div>Hello</div>',
  css: 'div { color: red; }',
  js: 'console.log("Hi");'
});

// Cargar todos los snippets
const snippets = await storage.getAllSnippets();

// Eliminar snippet
await storage.deleteSnippet('snippet-id');
```

## 🎯 Roadmap

- [ ] Exportar snippets como archivos
- [ ] Importar componentes externos
- [ ] Autocompletado en editor
- [ ] Más componentes (tabs, accordion, tooltip)
- [ ] Modo colaborativo con URL compartibles

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - siéntete libre de usar este proyecto para aprender y construir.

## 🙏 Créditos

- **CodeMirror**: Editor de código (CDN)
- **Web Components API**: Estándar del W3C
- **IndexedDB API**: Almacenamiento del navegador

---

**Desarrollado con ❤️ usando solo HTML, CSS y JavaScript vanilla**
