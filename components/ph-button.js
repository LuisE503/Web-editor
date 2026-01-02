/**
 * PHButton - Componente de botón personalizable
 * Web Component con Shadow DOM, múltiples variantes y tamaños
 * 
 * Uso:
 * <ph-button variant="primary" size="medium">Click me</ph-button>
 * 
 * Atributos:
 * - variant: primary (default), secondary, danger, success
 * - size: small, medium (default), large
 * - disabled: boolean
 * 
 * Eventos:
 * - click: Se emite cuando el botón es clickeado (si no está disabled)
 */

class PHButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._isDisabled = false;
  }

  // Atributos observados
  static get observedAttributes() {
    return ['variant', 'size', 'disabled'];
  }

  // Ciclo de vida: cuando se conecta al DOM
  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateAriaAttributes();
  }

  // Ciclo de vida: cuando cambian los atributos
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === 'disabled') {
        this._isDisabled = this.hasAttribute('disabled');
      }
      this.render();
      this.updateAriaAttributes();
    }
  }

  // Getters para atributos
  get variant() {
    return this.getAttribute('variant') || 'primary';
  }

  get size() {
    return this.getAttribute('size') || 'medium';
  }

  get disabled() {
    return this._isDisabled;
  }

  // Setter para disabled
  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  // Actualizar atributos ARIA para accesibilidad
  updateAriaAttributes() {
    this.setAttribute('role', 'button');
    this.setAttribute('aria-disabled', this._isDisabled.toString());
    
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', this._isDisabled ? '-1' : '0');
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    // Manejar click
    this.addEventListener('click', (e) => {
      if (this._isDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    });

    // Manejar teclado (Enter y Space)
    this.addEventListener('keydown', (e) => {
      if (this._isDisabled) return;
      
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  // Renderizar el componente
  render() {
    const variant = this.variant;
    const size = this.size;
    const disabled = this._isDisabled;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          --btn-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        button {
          /* Usar variables del sistema de diseño */
          font-family: var(--btn-font);
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid transparent;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          text-decoration: none;
          white-space: nowrap;
          user-select: none;
          position: relative;
          letter-spacing: -0.01em;
        }

        /* Tamaños refinados */
        button.small {
          padding: 0.4rem 0.875rem;
          font-size: 0.8125rem;
          line-height: 1.25;
          border-radius: 0.375rem;
        }

        button.medium {
          padding: 0.5625rem 1.125rem;
          font-size: 0.875rem;
          line-height: 1.25;
        }

        button.large {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          line-height: 1.25;
          border-radius: 0.625rem;
        }

        /* Primary - Indigo sólido */
        button.primary {
          background-color: var(--color-primary, #4f46e5);
          color: white;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        button.primary:hover:not(:disabled) {
          background-color: var(--color-primary-hover, #4338ca);
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.25), 0 2px 4px -1px rgba(79, 70, 229, 0.15);
        }

        button.primary:active:not(:disabled) {
          background-color: var(--color-primary-active, #3730a3);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        /* Secondary - Outline elegante */
        button.secondary {
          background-color: var(--color-surface, #ffffff);
          color: var(--color-text, #0f172a);
          border-color: var(--color-border, #e2e8f0);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        button.secondary:hover:not(:disabled) {
          background-color: var(--color-surface-alt, #f8fafc);
          border-color: var(--color-border-hover, #cbd5e1);
        }

        button.secondary:active:not(:disabled) {
          background-color: var(--color-surface-active, #f1f5f9);
        }

        /* Success - Emerald */
        button.success {
          background-color: var(--color-success, #059669);
          color: white;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        button.success:hover:not(:disabled) {
          background-color: #047857;
          box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.25);
        }

        button.success:active:not(:disabled) {
          background-color: #065f46;
        }

        /* Danger - Red */
        button.danger {
          background-color: var(--color-danger, #dc2626);
          color: white;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        button.danger:hover:not(:disabled) {
          background-color: #b91c1c;
          box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.25);
        }

        button.danger:active:not(:disabled) {
          background-color: #991b1b;
        }

        /* Ghost - Transparente */
        button.ghost {
          background-color: transparent;
          color: var(--color-text-secondary, #475569);
          border-color: transparent;
        }

        button.ghost:hover:not(:disabled) {
          background-color: var(--color-surface-alt, #f8fafc);
          color: var(--color-text, #0f172a);
        }

        button.ghost:active:not(:disabled) {
          background-color: var(--color-surface-active, #f1f5f9);
        }

        /* Estado disabled */
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none !important;
        }

        /* Focus visible - accesibilidad */
        button:focus-visible {
          outline: 2px solid var(--color-primary, #4f46e5);
          outline-offset: 2px;
        }

        /* Slot para iconos y contenido */
        ::slotted(svg) {
          width: 1em;
          height: 1em;
          pointer-events: none;
        }
      </style>
      <button 
        class="${variant} ${size}"
        ${disabled ? 'disabled' : ''}
        aria-label="${this.getAttribute('aria-label') || ''}"
      >
        <slot></slot>
      </button>
    `;
  }
}

// Registrar el componente
if (!customElements.get('ph-button')) {
  customElements.define('ph-button', PHButton);
}

// Exportar para uso con módulos
export { PHButton };
