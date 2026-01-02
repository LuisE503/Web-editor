/**
 * Main JavaScript - Lógica principal de HTMLKit Hub
 * Maneja la UI de la galería, carga de componentes y playground
 */

// Importar storage (se carga vía script tag en el HTML)
// const storage disponible globalmente

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadComponents();
  initGallery();
  initPlayground();
});

/**
 * Gestión de temas (claro/oscuro)
 */
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (!themeToggle) return;

  // Cargar tema guardado o usar preferencia del sistema
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  setTheme(initialTheme);

  // Toggle de tema
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // Escuchar cambios en preferencias del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Establecer tema
 */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Animación suave
  document.body.classList.add('theme-changing');
  setTimeout(() => {
    document.body.classList.remove('theme-changing');
  }, 300);
}

/**
 * Cargar Web Components dinámicamente
 */
function loadComponents() {
  const components = [
    '../components/ph-button.js',
    '../components/ph-modal.js',
    '../components/ph-card.js'
  ];

  components.forEach(component => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = component;
    document.head.appendChild(script);
  });
}

/**
 * Inicializar galería de componentes (index.html)
 */
function initGallery() {
  const searchInput = document.getElementById('search-components');
  const componentCards = document.querySelectorAll('.component-card');

  if (!searchInput) return;

  // Búsqueda de componentes
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    componentCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = card.querySelector('p')?.textContent.toLowerCase() || '';
      
      const matches = title.includes(searchTerm) || description.includes(searchTerm);
      
      card.style.display = matches ? 'block' : 'none';
    });

    // Mensaje si no hay resultados
    const visibleCards = Array.from(componentCards).filter(card => 
      card.style.display !== 'none'
    );

    const noResults = document.getElementById('no-results');
    if (noResults) {
      noResults.style.display = visibleCards.length === 0 ? 'block' : 'none';
    }
  });

  // Demos interactivos de componentes
  initComponentDemos();
}

/**
 * Inicializar demos de componentes
 */
function initComponentDemos() {
  // Demo de ph-button
  const buttonDemo = document.getElementById('button-demo');
  if (buttonDemo) {
    const demoButtons = buttonDemo.querySelectorAll('ph-button');
    demoButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        showNotification('¡Botón clickeado!', 'success');
      });
    });
  }

  // Demo de ph-modal
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal-trigger');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.show();
      }
    });
  });

  // Demo de ph-card
  const cardDemo = document.getElementById('card-demo');
  if (cardDemo) {
    const clickableCards = cardDemo.querySelectorAll('ph-card[clickable]');
    clickableCards.forEach(card => {
      card.addEventListener('card-click', (e) => {
        showNotification(`Tarjeta ${e.detail.variant} clickeada`, 'info');
      });
    });
  }
}

/**
 * Inicializar playground (playground.html)
 */
function initPlayground() {
  const playgroundContainer = document.getElementById('playground-container');
  
  if (!playgroundContainer) return;

  // Inicializar editores
  const editors = initEditors();
  
  // Botones de acción
  const runBtn = document.getElementById('run-code');
  const saveBtn = document.getElementById('save-snippet');
  const loadBtn = document.getElementById('load-snippet');
  const clearBtn = document.getElementById('clear-code');
  const newBtn = document.getElementById('new-snippet');

  // Ejecutar código
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const html = editors.html.getValue();
      const css = editors.css.getValue();
      const js = editors.js.getValue();
      
      runPreview({ html, css, js });
    });
  }

  // Guardar snippet
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      await saveCurrentSnippet(editors);
    });
  }

  // Cargar snippet
  if (loadBtn) {
    loadBtn.addEventListener('click', async () => {
      await showSnippetSelector(editors);
    });
  }

  // Limpiar código
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('¿Deseas limpiar todo el código?')) {
        editors.html.setValue('');
        editors.css.setValue('');
        editors.js.setValue('');
        clearPreview();
      }
    });
  }

  // Nuevo snippet
  if (newBtn) {
    newBtn.addEventListener('click', () => {
      if (confirm('¿Crear un nuevo snippet? Los cambios no guardados se perderán.')) {
        editors.html.setValue('');
        editors.css.setValue('');
        editors.js.setValue('');
        clearPreview();
        delete playgroundContainer.dataset.currentSnippetId;
      }
    });
  }

  // Auto-save cada 30 segundos
  setInterval(() => {
    autoSaveSnippet(editors);
  }, 30000);

  // Cargar templates de ejemplo
  loadExampleTemplates(editors);

  // Atajos de teclado
  setupKeyboardShortcuts(editors);
}

/**
 * Inicializar editores CodeMirror
 */
function initEditors() {
  // Si CodeMirror está disponible (cargado desde CDN)
  if (typeof CodeMirror !== 'undefined') {
    const htmlEditor = CodeMirror.fromTextArea(
      document.getElementById('html-editor'),
      {
        mode: 'htmlmixed',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseTags: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2
      }
    );

    const cssEditor = CodeMirror.fromTextArea(
      document.getElementById('css-editor'),
      {
        mode: 'css',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2
      }
    );

    const jsEditor = CodeMirror.fromTextArea(
      document.getElementById('js-editor'),
      {
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2
      }
    );

    return {
      html: htmlEditor,
      css: cssEditor,
      js: jsEditor
    };
  } else {
    // Fallback a textareas simples
    console.warn('CodeMirror no disponible, usando textareas simples');
    
    const htmlTextarea = document.getElementById('html-editor');
    const cssTextarea = document.getElementById('css-editor');
    const jsTextarea = document.getElementById('js-editor');

    return {
      html: {
        getValue: () => htmlTextarea.value,
        setValue: (value) => { htmlTextarea.value = value; }
      },
      css: {
        getValue: () => cssTextarea.value,
        setValue: (value) => { cssTextarea.value = value; }
      },
      js: {
        getValue: () => jsTextarea.value,
        setValue: (value) => { jsTextarea.value = value; }
      }
    };
  }
}

/**
 * Ejecutar código en el preview iframe
 * Incluye seguridad con sandbox y captura de errores
 */
function runPreview(code) {
  const iframe = document.getElementById('preview-frame');
  
  if (!iframe) return;

  // Limpiar console
  clearConsole();

  // Crear documento HTML completo con sandbox
  const htmlDoc = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 1rem;
        }
        ${code.css}
      </style>
    </head>
    <body>
      ${code.html}
      <script>
        // Capturar console.log
        (function() {
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;

          console.log = function(...args) {
            window.parent.postMessage({
              type: 'console',
              method: 'log',
              args: args
            }, '*');
            originalLog.apply(console, args);
          };

          console.error = function(...args) {
            window.parent.postMessage({
              type: 'console',
              method: 'error',
              args: args
            }, '*');
            originalError.apply(console, args);
          };

          console.warn = function(...args) {
            window.parent.postMessage({
              type: 'console',
              method: 'warn',
              args: args
            }, '*');
            originalWarn.apply(console, args);
          };

          // Capturar errores
          window.onerror = function(msg, url, line, col, error) {
            window.parent.postMessage({
              type: 'error',
              message: msg,
              line: line,
              col: col
            }, '*');
            return false;
          };

          // Timeout para prevenir loops infinitos
          setTimeout(() => {
            try {
              ${code.js}
            } catch (error) {
              console.error('Error:', error.message);
            }
          }, 0);
        })();
      </script>
    </body>
    </html>
  `;

  // Escribir en el iframe
  iframe.srcdoc = htmlDoc;

  showNotification('Código ejecutado', 'success');
}

/**
 * Limpiar preview
 */
function clearPreview() {
  const iframe = document.getElementById('preview-frame');
  if (iframe) {
    iframe.srcdoc = '<p style="color: #94a3b8; text-align: center; padding: 2rem;">El resultado aparecerá aquí</p>';
  }
  clearConsole();
}

/**
 * Limpiar consola
 */
function clearConsole() {
  const consoleOutput = document.getElementById('console-output');
  if (consoleOutput) {
    consoleOutput.innerHTML = '<div class="console-message" style="color: #94a3b8;">Console limpia</div>';
  }
}

/**
 * Escuchar mensajes del iframe (console.log, errores)
 */
window.addEventListener('message', (event) => {
  const consoleOutput = document.getElementById('console-output');
  
  if (!consoleOutput) return;

  if (event.data.type === 'console') {
    const message = document.createElement('div');
    message.className = `console-message console-${event.data.method}`;
    message.textContent = event.data.args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    consoleOutput.appendChild(message);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  } else if (event.data.type === 'error') {
    const message = document.createElement('div');
    message.className = 'console-message console-error';
    message.textContent = `Error (línea ${event.data.line}): ${event.data.message}`;
    consoleOutput.appendChild(message);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  }
});

/**
 * Guardar snippet actual
 */
async function saveCurrentSnippet(editors) {
  const name = prompt('Nombre del snippet:', 'Mi Snippet');
  
  if (!name) return;

  try {
    const snippet = {
      name,
      html: editors.html.getValue(),
      css: editors.css.getValue(),
      js: editors.js.getValue()
    };

    const saved = await storage.saveSnippet(snippet);
    
    // Guardar ID del snippet actual
    const container = document.getElementById('playground-container');
    if (container) {
      container.dataset.currentSnippetId = saved.id;
    }

    showNotification(`Snippet "${name}" guardado exitosamente`, 'success');
  } catch (error) {
    console.error('Error al guardar snippet:', error);
    showNotification('Error al guardar el snippet', 'danger');
  }
}

/**
 * Auto-guardar snippet
 */
async function autoSaveSnippet(editors) {
  const container = document.getElementById('playground-container');
  const currentId = container?.dataset.currentSnippetId;

  if (!currentId) return;

  try {
    await storage.updateSnippet(currentId, {
      html: editors.html.getValue(),
      css: editors.css.getValue(),
      js: editors.js.getValue()
    });
    
    console.log('Auto-guardado exitoso');
  } catch (error) {
    console.error('Error en auto-guardado:', error);
  }
}

/**
 * Mostrar selector de snippets
 */
async function showSnippetSelector(editors) {
  try {
    const snippets = await storage.getAllSnippets();
    
    if (snippets.length === 0) {
      showNotification('No hay snippets guardados', 'warning');
      return;
    }

    // Crear modal con lista de snippets
    const modal = document.createElement('ph-modal');
    modal.setAttribute('title', 'Cargar Snippet');
    modal.setAttribute('open', 'true');

    const list = document.createElement('div');
    list.className = 'snippet-list';
    
    snippets.forEach(snippet => {
      const item = document.createElement('div');
      item.className = 'snippet-item';
      item.innerHTML = `
        <div>
          <strong>${snippet.name}</strong>
          <small>Actualizado: ${new Date(snippet.updatedAt).toLocaleString()}</small>
        </div>
        <div class="snippet-actions">
          <button class="btn-load" data-id="${snippet.id}">Cargar</button>
          <button class="btn-delete" data-id="${snippet.id}">Eliminar</button>
        </div>
      `;
      list.appendChild(item);
    });

    modal.appendChild(list);
    document.body.appendChild(modal);

    // Event listeners
    list.addEventListener('click', async (e) => {
      const loadBtn = e.target.closest('.btn-load');
      const deleteBtn = e.target.closest('.btn-delete');

      if (loadBtn) {
        const id = loadBtn.dataset.id;
        const snippet = await storage.getSnippet(id);
        
        if (snippet) {
          editors.html.setValue(snippet.html);
          editors.css.setValue(snippet.css);
          editors.js.setValue(snippet.js);
          
          const container = document.getElementById('playground-container');
          if (container) {
            container.dataset.currentSnippetId = id;
          }

          modal.hide();
          showNotification(`Snippet "${snippet.name}" cargado`, 'success');
        }
      } else if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        if (confirm('¿Eliminar este snippet?')) {
          await storage.deleteSnippet(id);
          deleteBtn.closest('.snippet-item').remove();
          showNotification('Snippet eliminado', 'success');
        }
      }
    });

    modal.addEventListener('modal-close', () => {
      modal.remove();
    });
  } catch (error) {
    console.error('Error al cargar snippets:', error);
    showNotification('Error al cargar snippets', 'danger');
  }
}

/**
 * Cargar templates de ejemplo
 */
async function loadExampleTemplates(editors) {
  const templateSelect = document.getElementById('template-select');
  
  if (!templateSelect) return;

  try {
    const response = await fetch('../examples/templates.json');
    const templates = await response.json();

    templates.forEach(template => {
      const option = document.createElement('option');
      option.value = JSON.stringify(template);
      option.textContent = template.name;
      templateSelect.appendChild(option);
    });

    templateSelect.addEventListener('change', (e) => {
      if (!e.target.value) return;

      const template = JSON.parse(e.target.value);
      editors.html.setValue(template.html);
      editors.css.setValue(template.css);
      editors.js.setValue(template.js);

      showNotification(`Template "${template.name}" cargado`, 'info');
      
      // Reset select
      e.target.value = '';
    });
  } catch (error) {
    console.error('Error al cargar templates:', error);
  }
}

/**
 * Configurar atajos de teclado
 */
function setupKeyboardShortcuts(editors) {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter: Ejecutar código
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('run-code')?.click();
    }

    // Ctrl/Cmd + S: Guardar
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      document.getElementById('save-snippet')?.click();
    }
  });
}

/**
 * Mostrar notificación
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Exportar funciones para uso global
window.runPreview = runPreview;
window.showNotification = showNotification;
