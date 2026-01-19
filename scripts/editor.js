/**
 * CodeCraft Studio - Editor Script
 * Professional code editor with real-time preview
 */

(function() {
  'use strict';
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  const state = {
    editors: {},
    currentTab: 'html',
    autoSaveInterval: null,
    currentProject: null
  };
  
  // ==========================================
  // INITIALIZE CODEMIRROR EDITORS
  // ==========================================
  
  function initEditors() {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dracula' : 'eclipse';
    
    // Create textareas if needed
    const htmlEditorEl = document.getElementById('html-editor');
    const cssEditorEl = document.getElementById('css-editor');
    const jsEditorEl = document.getElementById('js-editor');
    
    // HTML Editor
    state.editors.html = CodeMirror(htmlEditorEl, {
      mode: 'htmlmixed',
      theme: theme,
      lineNumbers: true,
      autoCloseTags: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: true,
      value: '<!-- Write your HTML here -->\n<h1>Hello World</h1>\n<p>Start coding!</p>'
    });
    
    // CSS Editor
    state.editors.css = CodeMirror(cssEditorEl, {
      mode: 'css',
      theme: theme,
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: true,
      value: '/* Write your CSS here */\nbody {\n  font-family: Arial, sans-serif;\n  padding: 2rem;\n}\n\nh1 {\n  color: #667eea;\n}'
    });
    
    // JavaScript Editor
    state.editors.js = CodeMirror(jsEditorEl, {
      mode: 'javascript',
      theme: theme,
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      lineWrapping: true,
      value: '// Write your JavaScript here\nconsole.log("Hello from CodeCraft Studio!");'
    });
    
    // Auto-run on change (debounced)
    let debounceTimer;
    Object.values(state.editors).forEach(editor => {
      editor.on('change', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          runCode();
        }, 1000);
      });
    });
    
    console.log('✅ Editors initialized');
  }
  
  // ==========================================
  // TAB SWITCHING
  // ==========================================
  
  function initTabs() {
    const tabs = document.querySelectorAll('.editor-tab');
    const editors = document.querySelectorAll('.code-editor');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-editor');
        
        // Update active states
        tabs.forEach(t => t.classList.remove('active'));
        editors.forEach(e => e.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${tabName}-editor`).classList.add('active');
        
        // Refresh editor
        if (state.editors[tabName]) {
          state.editors[tabName].refresh();
        }
        state.currentTab = tabName;
      });
    });
  }
  
  // ==========================================
  // RUN CODE
  // ==========================================
  
  function runCode() {
    const html = state.editors.html.getValue();
    const css = state.editors.css.getValue();
    const js = state.editors.js.getValue();
    
    const iframe = document.getElementById('preview-frame');
    if (!iframe) return;
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Create complete HTML document
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>
          // Console override to capture logs
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
          };
          
          function sendToParentConsole(type, args) {
            window.parent.postMessage({
              type: 'console',
              level: type,
              message: Array.from(args).map(arg => {
                if (typeof arg === 'object') {
                  try {
                    return JSON.stringify(arg, null, 2);
                  } catch (e) {
                    return String(arg);
                  }
                }
                return String(arg);
              }).join(' ')
            }, '*');
          }
          
          console.log = function(...args) {
            originalConsole.log.apply(console, args);
            sendToParentConsole('log', args);
          };
          
          console.error = function(...args) {
            originalConsole.error.apply(console, args);
            sendToParentConsole('error', args);
          };
          
          console.warn = function(...args) {
            originalConsole.warn.apply(console, args);
            sendToParentConsole('warn', args);
          };
          
          console.info = function(...args) {
            originalConsole.info.apply(console, args);
            sendToParentConsole('info', args);
          };
          
          // Error handling
          window.onerror = function(message, source, lineno, colno, error) {
            sendToParentConsole('error', ['Error: ' + message + ' (Line ' + lineno + ')']);
            return false;
          };
          
          // Run user script
          try {
            ${js}
          } catch (error) {
            sendToParentConsole('error', ['JavaScript Error: ' + error.message]);
          }
        <\/script>
      </body>
      </html>
    `;
    
    iframeDoc.open();
    iframeDoc.write(fullHTML);
    iframeDoc.close();
  }
  
  // ==========================================
  // CONSOLE OUTPUT
  // ==========================================
  
  function initConsole() {
    const consoleOutput = document.getElementById('console-output');
    const clearConsoleBtn = document.getElementById('clear-console-btn');
    
    // Listen for messages from iframe
    window.addEventListener('message', (event) => {
      if (event.data.type === 'console') {
        addConsoleMessage(event.data.level, event.data.message);
      }
    });
    
    // Clear console
    if (clearConsoleBtn) {
      clearConsoleBtn.addEventListener('click', () => {
        if (consoleOutput) {
          consoleOutput.innerHTML = '<div class="console-message info">Console cleared.</div>';
        }
      });
    }
  }
  
  function addConsoleMessage(level, message) {
    const consoleOutput = document.getElementById('console-output');
    if (!consoleOutput) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = `console-message ${level}`;
    messageEl.textContent = `[${level.toUpperCase()}] ${message}`;
    consoleOutput.appendChild(messageEl);
    
    // Auto scroll to bottom
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
    
    // Limit messages (keep last 100)
    const messages = consoleOutput.querySelectorAll('.console-message');
    if (messages.length > 100) {
      messages[0].remove();
    }
  }
  
  // ==========================================
  // NOTIFICATION SYSTEM
  // ==========================================
  
  function showNotification(title, message, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas ${icons[type] || icons.info}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" aria-label="Close notification">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    container.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentElement) {
          notification.style.animation = 'slideOutRight 0.3s ease-out';
          setTimeout(() => notification.remove(), 300);
        }
      }, duration);
    }
  }
  
  // ==========================================
  // TEMPLATES
  // ==========================================
  
  async function loadTemplates() {
    try {
      const response = await fetch('../../examples/templates.json');
      const templates = await response.json();
      
      const select = document.getElementById('template-select');
      if (!select) return;
      
      // Group templates by category
      const categories = {};
      templates.forEach(template => {
        const category = template.category || 'Other';
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(template);
      });
      
      // Add options grouped by category
      Object.keys(categories).sort().forEach(category => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;
        
        categories[category].forEach(template => {
          const option = document.createElement('option');
          option.value = JSON.stringify(template);
          option.textContent = template.name;
          optgroup.appendChild(option);
        });
        
        select.appendChild(optgroup);
      });
      
      // Handle template selection
      select.addEventListener('change', (e) => {
        if (e.target.value) {
          const template = JSON.parse(e.target.value);
          loadTemplate(template);
          e.target.value = ''; // Reset selection
        }
      });
      
      console.log(`✅ Loaded ${templates.length} templates`);
    } catch (error) {
      console.error('Error loading templates:', error);
      showNotification('Error', 'Could not load templates', 'error');
    }
  }
  
  function loadTemplate(template) {
    // Set editor values - FIXED: Now properly filters HTML, CSS, and JS
    if (template.html !== undefined) {
      state.editors.html.setValue(template.html);
    }
    if (template.css !== undefined) {
      state.editors.css.setValue(template.css);
    }
    if (template.js !== undefined) {
      state.editors.js.setValue(template.js);
    }
    
    // Run the code
    runCode();
    
    showNotification(
      'Template Loaded',
      `"${template.name}" has been loaded successfully`,
      'success'
    );
    
    addConsoleMessage('info', `Template "${template.name}" loaded`);
  }
  
  // ==========================================
  // PROJECT MANAGEMENT
  // ==========================================
  
  function saveProject() {
    const projectName = prompt('Project name:', state.currentProject || 'My Project');
    
    if (!projectName) return;
    
    const project = {
      name: projectName,
      html: state.editors.html.getValue(),
      css: state.editors.css.getValue(),
      js: state.editors.js.getValue(),
      savedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const projects = JSON.parse(localStorage.getItem('codecraft_projects') || '[]');
    
    // Update or add project
    const existingIndex = projects.findIndex(p => p.name === projectName);
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    localStorage.setItem('codecraft_projects', JSON.stringify(projects));
    state.currentProject = projectName;
    
    showNotification(
      'Project Saved',
      `"${projectName}" has been saved successfully`,
      'success'
    );
    
    addConsoleMessage('info', `Project "${projectName}" saved`);
  }
  
  function loadProject() {
    const projects = JSON.parse(localStorage.getItem('codecraft_projects') || '[]');
    
    if (projects.length === 0) {
      showNotification(
        'No Projects',
        'You have no saved projects yet',
        'info'
      );
      return;
    }
    
    // Create selection dialog
    const projectList = projects.map((p, i) => `${i + 1}. ${p.name} (${new Date(p.savedAt).toLocaleDateString()})`).join('\n');
    const selection = prompt(`Select a project:\n\n${projectList}\n\nEnter the number:`);
    
    if (!selection) return;
    
    const index = parseInt(selection) - 1;
    if (index >= 0 && index < projects.length) {
      const project = projects[index];
      
      state.editors.html.setValue(project.html);
      state.editors.css.setValue(project.css);
      state.editors.js.setValue(project.js);
      state.currentProject = project.name;
      
      runCode();
      
      showNotification(
        'Project Loaded',
        `"${project.name}" has been loaded successfully`,
        'success'
      );
      
      addConsoleMessage('info', `Project "${project.name}" loaded`);
    } else {
      showNotification('Error', 'Invalid selection', 'error');
    }
  }
  
  function newProject() {
    if (confirm('Create a new project? Unsaved changes will be lost.')) {
      state.editors.html.setValue('<!-- Write your HTML here -->\n<h1>Hello World</h1>\n<p>Start coding!</p>');
      state.editors.css.setValue('/* Write your CSS here */\nbody {\n  font-family: Arial, sans-serif;\n  padding: 2rem;\n}\n\nh1 {\n  color: #667eea;\n}');
      state.editors.js.setValue('// Write your JavaScript here\nconsole.log("Hello from CodeCraft Studio!");');
      state.currentProject = null;
      
      runCode();
      
      showNotification(
        'New Project',
        'Project cleared successfully',
        'success'
      );
    }
  }
  
  function clearAll() {
    if (confirm('Clear all code? This action cannot be undone.')) {
      state.editors.html.setValue('');
      state.editors.css.setValue('');
      state.editors.js.setValue('');
      
      const iframe = document.getElementById('preview-frame');
      if (iframe) iframe.src = 'about:blank';
      
      const consoleOutput = document.getElementById('console-output');
      if (consoleOutput) {
        consoleOutput.innerHTML = '<div class="console-message info">Console cleared.</div>';
      }
      
      showNotification(
        'All Cleared',
        'Code has been deleted',
        'info'
      );
    }
  }
  
  // ==========================================
  // AUTO-SAVE
  // ==========================================
  
  function initAutoSave() {
    state.autoSaveInterval = setInterval(() => {
      const autosave = {
        html: state.editors.html.getValue(),
        css: state.editors.css.getValue(),
        js: state.editors.js.getValue(),
        timestamp: Date.now()
      };
      
      localStorage.setItem('codecraft_autosave', JSON.stringify(autosave));
    }, 30000); // Every 30 seconds
    
    // Load autosave on init
    const autosave = JSON.parse(localStorage.getItem('codecraft_autosave') || 'null');
    if (autosave) {
      const age = Date.now() - autosave.timestamp;
      if (age < 3600000) { // Less than 1 hour old
        if (confirm('Recent autosave found. Would you like to restore it?')) {
          state.editors.html.setValue(autosave.html);
          state.editors.css.setValue(autosave.css);
          state.editors.js.setValue(autosave.js);
          runCode();
        }
      }
    }
  }
  
  // ==========================================
  // THEME SWITCHING
  // ==========================================
  
  function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setEditorTheme(initialTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setEditorTheme(newTheme);
        updateThemeIcon(newTheme);
      });
    }
  }
  
  function setEditorTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const cmTheme = theme === 'dark' ? 'dracula' : 'eclipse';
    Object.values(state.editors).forEach(editor => {
      editor.setOption('theme', cmTheme);
    });
    
    updateThemeIcon(theme);
  }
  
  function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  }
  
  // ==========================================
  // KEYBOARD SHORTCUTS
  // ==========================================
  
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + Enter = Run
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
        showNotification('Running', 'Code executed', 'info', 1500);
      }
      
      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveProject();
      }
      
      // Ctrl/Cmd + K = Clear console
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const consoleOutput = document.getElementById('console-output');
        if (consoleOutput) {
          consoleOutput.innerHTML = '<div class="console-message info">Console cleared.</div>';
        }
      }
    });
  }
  
  // ==========================================
  // BUTTON HANDLERS
  // ==========================================
  
  function initButtons() {
    const runBtn = document.getElementById('run-btn');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const newBtn = document.getElementById('new-btn');
    
    if (runBtn) runBtn.addEventListener('click', runCode);
    if (saveBtn) saveBtn.addEventListener('click', saveProject);
    if (loadBtn) loadBtn.addEventListener('click', loadProject);
    if (newBtn) newBtn.addEventListener('click', newProject);
  }
  
  // ==========================================
  // INITIALIZE APPLICATION
  // ==========================================
  
  function init() {
    console.log('%cCodeCraft Studio Editor', 'font-size: 20px; font-weight: bold; color: #667eea;');
    console.log('Initializing...');
    
    initEditors();
    initTabs();
    initConsole();
    initTheme();
    initButtons();
    initKeyboardShortcuts();
    initAutoSave();
    
    // Load templates
    loadTemplates();
    
    // Initial run
    setTimeout(() => {
      runCode();
    }, 500);
    
    showNotification(
      'Welcome! 👋',
      'CodeCraft Studio is ready. Start coding!',
      'success'
    );
    
    console.log('✅ Editor initialized successfully');
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
