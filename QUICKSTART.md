# 🚀 Guía de Inicio Rápido - HTMLKit Hub

Esta guía te ayudará a comenzar con HTMLKit Hub en menos de 5 minutos.

## ⚡ Inicio Rápido

### Opción 1: Abrir Directamente (Más Simple)

1. **Descarga el proyecto**
   ```bash
   git clone https://github.com/TU_USUARIO/htmlkit-hub.git
   cd htmlkit-hub
   ```

2. **Abre en el navegador**
   - Simplemente abre `index.html` con tu navegador
   - ¡Listo! Ya puedes explorar los componentes

### Opción 2: Servidor Local (Recomendado)

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

Luego abre: `http://localhost:8000`

## 📚 Tutorial Básico

### 1. Explorar la Galería

1. Abre `index.html`
2. Navega por los componentes disponibles
3. Interactúa con los demos
4. Revisa el código de cada componente

### 2. Usar el Playground

1. Haz click en "Ir al Playground"
2. Edita el código HTML, CSS y JavaScript
3. Presiona "Ejecutar" (o Ctrl+Enter)
4. Ve el resultado en el preview

### 3. Crear tu Primer Componente

```html
<!-- Ejemplo básico con PHButton -->
<ph-button variant="primary" size="medium">
  Mi Botón
</ph-button>

<script>
  document.querySelector('ph-button').addEventListener('click', () => {
    alert('¡Botón clickeado!');
  });
</script>
```

### 4. Usar PHModal

```html
<ph-button id="openBtn" variant="primary">
  Abrir Modal
</ph-button>

<ph-modal id="myModal" title="Mi Modal">
  <p>Contenido del modal aquí</p>
</ph-modal>

<script>
  const btn = document.getElementById('openBtn');
  const modal = document.getElementById('myModal');
  
  btn.addEventListener('click', () => {
    modal.show();
  });
</script>
```

### 5. Crear Tarjetas con PHCard

```html
<ph-card variant="elevated">
  <h3 slot="header">Título de la Tarjeta</h3>
  <p slot="body">
    Contenido de la tarjeta con información importante.
  </p>
  <ph-button slot="footer" variant="primary">
    Acción
  </ph-button>
</ph-card>
```

## 🎨 Personalizar Temas

### Cambiar Tema Manualmente

```javascript
// Tema oscuro
document.documentElement.setAttribute('data-theme', 'dark');

// Tema claro
document.documentElement.setAttribute('data-theme', 'light');
```

### Personalizar Colores

Edita las variables CSS en `styles/themes.css`:

```css
:root {
  --color-primary: #2563eb;  /* Tu color personalizado */
  --color-success: #10b981;
  /* ... más variables */
}
```

## 💾 Guardar y Cargar Snippets

### Guardar un Snippet

1. Escribe tu código en el playground
2. Click en "💾 Guardar"
3. Dale un nombre
4. Se guarda automáticamente en IndexedDB

### Cargar un Snippet

1. Click en "📂 Cargar"
2. Selecciona el snippet de la lista
3. El código se carga en el editor

### API de Storage

```javascript
// Guardar
await storage.saveSnippet({
  name: 'Mi Snippet',
  html: '<div>HTML</div>',
  css: 'div { color: red; }',
  js: 'console.log("Hi");'
});

// Cargar todos
const snippets = await storage.getAllSnippets();

// Obtener uno
const snippet = await storage.getSnippet('snippet-id');

// Eliminar
await storage.deleteSnippet('snippet-id');
```

## ⌨️ Atajos de Teclado

En el Playground:

- **Ctrl/Cmd + Enter**: Ejecutar código
- **Ctrl/Cmd + S**: Guardar snippet
- **Escape**: Cerrar modal/ayuda
- **Tab**: Navegar entre elementos

## 🎯 Templates de Ejemplo

El playground incluye 5 templates predefinidos:

1. **Hello World Básico**: Introducción simple
2. **Contador Interactivo**: Manejo de estado
3. **Lista de Tareas**: CRUD básico
4. **Tarjetas con Web Components**: Uso de componentes
5. **Animación y Transiciones**: Efectos CSS

Accede a ellos desde el selector "📋 Cargar Template..." en el playground.

## 🔧 Solución de Problemas

### El código no se ejecuta

1. Abre la consola del navegador (F12)
2. Revisa si hay errores
3. Verifica la sintaxis del código
4. Asegúrate de hacer click en "Ejecutar"

### Los componentes no aparecen

1. Verifica que los scripts estén cargados
2. Abre la consola y busca errores
3. Asegúrate de usar un servidor local (no `file://`)

### El tema no cambia

1. Verifica localStorage del navegador
2. Limpia la cache
3. Recarga la página (Ctrl+F5)

### Los snippets no se guardan

1. Verifica que IndexedDB esté habilitado
2. Revisa si hay errores en la consola
3. Intenta usar localStorage como fallback

## 📱 Usar en Móvil

1. Despliega en GitHub Pages (ver README.md)
2. Accede desde tu móvil
3. El playground es completamente responsive
4. Usa los Web Components en tus propios proyectos móviles

## 🌐 Desplegar en GitHub Pages

```bash
# 1. Push tu código
git add .
git commit -m "Initial commit"
git push origin main

# 2. GitHub Actions se encarga del resto
# 3. Tu sitio estará en:
# https://TU_USUARIO.github.io/htmlkit-hub/
```

## 📖 Próximos Pasos

1. **Explora la documentación completa** en README.md
2. **Revisa el checklist de accesibilidad** en `tests/`
3. **Crea tus propios componentes** siguiendo los ejemplos
4. **Contribuye al proyecto** (ver CONTRIBUTING.md)
5. **Comparte tus creaciones** en redes sociales

## 🆘 Ayuda y Recursos

- **Documentación completa**: README.md
- **Guía de contribución**: CONTRIBUTING.md
- **Checklist de accesibilidad**: tests/accessibility-checklist.md
- **Issues en GitHub**: Reporta bugs o solicita features

## 💡 Tips Útiles

1. **Usa console.log()** en el playground - aparecerá en la consola integrada
2. **Guarda frecuentemente** - hay auto-save cada 30 segundos
3. **Experimenta con los templates** - son excelentes puntos de partida
4. **Prueba ambos temas** - asegúrate de que tu código se vea bien en ambos
5. **Usa el toggle de ayuda (?)** en el playground para ver atajos

## 🎉 ¡Listo!

Ya estás preparado para usar HTMLKit Hub. ¡Diviértete creando!

---

**¿Encontraste un problema o tienes una pregunta?**  
Abre un issue en GitHub o revisa la documentación completa.
