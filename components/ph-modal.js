/**
 * PHModal - Componente de modal accesible
 * Web Component con Shadow DOM, gestión de foco y backdrop
 * 
 * Uso:
 * <ph-modal title="Mi Modal" open="true">
 *   <p>Contenido del modal</p>
 * </ph-modal>
 * 
 * Atributos:
 * - title: título del modal
 * - open: boolean para mostrar/ocultar
 * - close-on-backdrop: boolean (default: true) - cerrar al hacer click en el backdrop
 * - close-on-escape: boolean (default: true) - cerrar con tecla Escape
 * 
 * Métodos:
 * - show(): muestra el modal
 * - hide(): oculta el modal
 * - toggle(): alterna visibilidad
 * 
 * Eventos:
 * - modal-open: se emite cuando el modal se abre
 * - modal-close: se emite cuando el modal se cierra
 */

class PHModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isOpen = false;
    this._previousActiveElement = null;
  }

  static get observedAttributes() {
    return ['open', 'title', 'close-on-backdrop', 'close-on-escape'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateAriaAttributes();
    
    // Sincronizar estado inicial
    if (this.hasAttribute('open')) {
      this._isOpen = true;
      this.updateVisibility();
    }
  }

  disconnectedCallback() {
    // Restaurar foco si el modal estaba abierto
    if (this._isOpen && this._previousActiveElement) {
      this._previousActiveElement.focus();
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'open') {
        this._isOpen = this.hasAttribute('open');
        this.updateVisibility();
      }
      if (name === 'title') {
        this.updateTitle();
      }
      this.updateAriaAttributes();
    }
  }

  // Getters
  get open() {
    return this._isOpen;
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  get closeOnBackdrop() {
    return this.getAttribute('close-on-backdrop') !== 'false';
  }

  get closeOnEscape() {
    return this.getAttribute('close-on-escape') !== 'false';
  }

  // Métodos públicos
  show() {
    if (!this._isOpen) {
      this._isOpen = true;
      this.setAttribute('open', '');
      this.updateVisibility();
      this.dispatchEvent(new CustomEvent('modal-open', {
        bubbles: true,
        composed: true
      }));
    }
  }

  hide() {
    if (this._isOpen) {
      this._isOpen = false;
      this.removeAttribute('open');
      this.updateVisibility();
      this.dispatchEvent(new CustomEvent('modal-close', {
        bubbles: true,
        composed: true
      }));
    }
  }

  toggle() {
    if (this._isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  updateAriaAttributes() {
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('aria-hidden', (!this._isOpen).toString());
    
    if (this.title) {
      this.setAttribute('aria-label', this.title);
    }
  }

  updateTitle() {
    const titleElement = this.shadowRoot.querySelector('.modal-title');
    if (titleElement) {
      titleElement.textContent = this.title;
    }
  }

  updateVisibility() {
    const container = this.shadowRoot.querySelector('.modal-container');
    if (!container) return;

    if (this._isOpen) {
      container.classList.add('open');
      document.body.style.overflow = 'hidden';
      
      // Guardar elemento activo y mover foco
      this._previousActiveElement = document.activeElement;
      
      // Esperar a que la animación comience antes de mover el foco
      setTimeout(() => {
        const closeButton = this.shadowRoot.querySelector('.modal-close');
        if (closeButton) {
          closeButton.focus();
        }
      }, 100);
      
      // Trap focus dentro del modal
      this.trapFocus();
    } else {
      container.classList.remove('open');
      document.body.style.overflow = '';
      
      // Restaurar foco al elemento anterior
      if (this._previousActiveElement && this._previousActiveElement.focus) {
        this._previousActiveElement.focus();
      }
      this._previousActiveElement = null;
    }
  }

  trapFocus() {
    const focusableElements = this.shadowRoot.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Remover listeners anteriores
    this.shadowRoot.removeEventListener('keydown', this._handleFocusTrap);
    
    this._handleFocusTrap = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (this.shadowRoot.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (this.shadowRoot.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    this.shadowRoot.addEventListener('keydown', this._handleFocusTrap);
  }

  setupEventListeners() {
    // Click en el botón de cerrar
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-close')) {
        this.hide();
      }
      
      // Click en el backdrop
      if (this.closeOnBackdrop && e.target.classList.contains('modal-backdrop')) {
        this.hide();
      }
    });

    // Tecla Escape
    if (this.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this._isOpen) {
          this.hide();
        }
      });
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: contents;
          --modal-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .modal-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1050;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-container.open {
          display: flex;
        }

        .modal-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          animation: backdropFadeIn 200ms ease-out;
        }

        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          font-family: var(--modal-font);
          position: relative;
          background-color: var(--color-surface, #ffffff);
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          max-width: 480px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          animation: modalSlideIn 300ms cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid var(--color-border, #e2e8f0);
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border, #e2e8f0);
          gap: 1rem;
        }

        .modal-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text-heading, #1e293b);
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.4;
        }

        .modal-close {
          background: transparent;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-tertiary, #94a3b8);
          transition: all 150ms ease;
          flex-shrink: 0;
          margin: -0.25rem;
        }

        .modal-close:hover {
          background-color: var(--color-surface-alt, #f8fafc);
          color: var(--color-text, #0f172a);
        }

        .modal-close:focus-visible {
          outline: 2px solid var(--color-primary, #4f46e5);
          outline-offset: 2px;
        }

        .modal-close svg {
          width: 18px;
          height: 18px;
        }

        .modal-body {
          padding: 1.5rem;
          color: var(--color-text-secondary, #475569);
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        /* Scrollbar */
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: var(--color-border, #e2e8f0);
          border-radius: 3px;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .modal-container {
            padding: 1rem;
            align-items: flex-end;
          }

          .modal-content {
            max-width: 100%;
            max-height: 90vh;
            border-radius: 1rem 1rem 0 0;
            animation-name: modalSlideUp;
          }

          @keyframes modalSlideUp {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }

        /* Reducir movimiento */
        @media (prefers-reduced-motion: reduce) {
          .modal-backdrop,
          .modal-content {
            animation: none;
          }
        }
      </style>
      
      <div class="modal-container" role="presentation">
        <div class="modal-backdrop" aria-hidden="true"></div>
        <div class="modal-content" role="document">
          <div class="modal-header">
            <h2 class="modal-title" id="modal-title">${this.title}</h2>
            <button 
              class="modal-close" 
              aria-label="Cerrar modal"
              type="button"
            >
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

// Registrar el componente
if (!customElements.get('ph-modal')) {
  customElements.define('ph-modal', PHModal);
}

// Exportar para uso con módulos
export { PHModal };
