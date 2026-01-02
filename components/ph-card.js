/**
 * PHCard - Componente de tarjeta con slots
 * Web Component con Shadow DOM y múltiples variantes
 * 
 * Uso:
 * <ph-card variant="elevated">
 *   <h3 slot="header">Título</h3>
 *   <p slot="body">Contenido</p>
 *   <button slot="footer">Acción</button>
 * </ph-card>
 * 
 * Atributos:
 * - variant: flat (default), elevated, outlined
 * - clickable: boolean - añade efecto hover e interactividad
 * 
 * Slots:
 * - header: contenido del encabezado
 * - body: contenido principal (slot por defecto)
 * - footer: contenido del pie
 * 
 * Eventos:
 * - card-click: se emite cuando la tarjeta es clickeable y se hace click
 */

class PHCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'clickable'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.updateAriaAttributes();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.updateAriaAttributes();
    }
  }

  // Getters
  get variant() {
    return this.getAttribute('variant') || 'flat';
  }

  get clickable() {
    return this.hasAttribute('clickable');
  }

  updateAriaAttributes() {
    if (this.clickable) {
      this.setAttribute('role', 'button');
      this.setAttribute('tabindex', '0');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('tabindex');
    }
  }

  setupEventListeners() {
    if (this.clickable) {
      this.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('card-click', {
          bubbles: true,
          composed: true,
          detail: { variant: this.variant }
        }));
      });

      this.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    }
  }

  render() {
    const variant = this.variant;
    const clickable = this.clickable;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --card-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .card {
          font-family: var(--card-font);
          background-color: var(--color-surface, #ffffff);
          border-radius: 0.75rem;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        /* Variante flat (default) - borde sutil */
        .card.flat {
          border: 1px solid var(--color-border, #e2e8f0);
          background-color: var(--color-surface, #ffffff);
        }

        .card.flat:hover {
          border-color: var(--color-border-hover, #cbd5e1);
        }

        /* Variante elevated - sombra elegante */
        .card.elevated {
          border: 1px solid var(--color-border, #e2e8f0);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .card.elevated:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-color: var(--color-border-hover, #cbd5e1);
        }

        /* Variante outlined - borde pronunciado */
        .card.outlined {
          border: 2px solid var(--color-border, #e2e8f0);
          background-color: transparent;
        }

        .card.outlined:hover {
          border-color: var(--color-primary, #4f46e5);
          background-color: var(--color-primary-light, #e0e7ff);
        }

        /* Clickable state */
        .card.clickable {
          cursor: pointer;
        }

        .card.clickable:active {
          transform: scale(0.99);
        }

        .card.clickable:focus-visible {
          outline: 2px solid var(--color-primary, #4f46e5);
          outline-offset: 2px;
        }

        /* Header */
        .card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border, #e2e8f0);
        }

        .card-header:empty {
          display: none;
        }

        ::slotted([slot="header"]) {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-heading, #1e293b);
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        /* Body */
        .card-body {
          padding: 1.5rem;
          flex: 1;
          color: var(--color-text, #0f172a);
        }

        ::slotted([slot="body"] p),
        ::slotted(p) {
          margin-bottom: 0.75rem;
          line-height: 1.6;
          color: var(--color-text-secondary, #475569);
          font-size: 0.9375rem;
        }

        ::slotted([slot="body"] p:last-child),
        ::slotted(p:last-child) {
          margin-bottom: 0;
        }

        /* Footer */
        .card-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--color-border, #e2e8f0);
          background-color: var(--color-surface-alt, #f8fafc);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .card-footer:empty {
          display: none;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .card-header,
          .card-body {
            padding: 1rem 1.25rem;
          }

          .card-footer {
            padding: 0.875rem 1.25rem;
            flex-direction: column;
            align-items: stretch;
          }
        }

        /* Reducir movimiento */
        @media (prefers-reduced-motion: reduce) {
          .card {
            transition: none;
          }
        }
      </style>
      
      <div class="card ${variant} ${clickable ? 'clickable' : ''}" role="${clickable ? 'button' : 'article'}">
        <div class="card-header">
          <slot name="header"></slot>
        </div>
        <div class="card-body">
          <slot name="body">
            <slot></slot>
          </slot>
        </div>
        <div class="card-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}

// Registrar el componente
if (!customElements.get('ph-card')) {
  customElements.define('ph-card', PHCard);
}

// Exportar para uso con módulos
export { PHCard };
