# Checklist de Accesibilidad - HTMLKit Hub

Este documento contiene los tests manuales de accesibilidad que deben verificarse para asegurar que todos los componentes cumplan con las pautas WCAG 2.1 nivel AA.

## 🎯 Tests Generales

### Navegación por Teclado
- [ ] **Tab Navigation**: Todos los elementos interactivos son accesibles usando Tab
- [ ] **Tab Order**: El orden de tabulación es lógico y sigue el flujo visual
- [ ] **Shift+Tab**: La navegación inversa funciona correctamente
- [ ] **Enter/Space**: Los botones y elementos clickeables responden a Enter y Space
- [ ] **Escape**: Los modales y overlays se cierran con Escape
- [ ] **Arrow Keys**: Los componentes con múltiples opciones responden a flechas (si aplica)

### Focus Management
- [ ] **Focus Visible**: El outline de foco es visible en todos los elementos interactivos
- [ ] **Focus Trap**: Los modales mantienen el foco dentro de ellos mientras están abiertos
- [ ] **Focus Return**: El foco regresa al elemento correcto al cerrar modales
- [ ] **No Focus Loss**: El foco nunca se pierde durante la navegación
- [ ] **Skip Links**: Existe una forma de saltar al contenido principal (si aplica)

### Colores y Contraste
- [ ] **Contraste de Texto**: Ratio mínimo de 4.5:1 para texto normal
- [ ] **Contraste de Texto Grande**: Ratio mínimo de 3:1 para texto grande (18pt+)
- [ ] **Contraste de UI**: Ratio mínimo de 3:1 para elementos de interfaz
- [ ] **Independencia del Color**: La información no se transmite solo por color
- [ ] **Tema Oscuro**: Ambos temas (claro/oscuro) cumplen con contraste

### Lectores de Pantalla
- [ ] **Estructura Semántica**: Uso correcto de elementos HTML5 (header, nav, main, footer, article)
- [ ] **Headings**: Jerarquía correcta de encabezados (h1-h6)
- [ ] **Landmarks**: Regiones ARIA correctamente etiquetadas
- [ ] **Alt Text**: Todas las imágenes tienen texto alternativo
- [ ] **ARIA Labels**: Labels apropiados en elementos sin texto visible
- [ ] **Live Regions**: Anuncios dinámicos usan aria-live apropiadamente

### Responsive y Zoom
- [ ] **200% Zoom**: El contenido sigue siendo legible al 200% de zoom
- [ ] **Texto Responsive**: El texto se ajusta sin pérdida de contenido
- [ ] **No Scroll Horizontal**: Sin scroll horizontal inesperado a 320px de ancho
- [ ] **Touch Targets**: Elementos táctiles de al menos 44x44px
- [ ] **Reflow**: El contenido se reorganiza correctamente en móviles

## 🔘 PHButton Component

### Tests Específicos
- [ ] **Atributo role**: `role="button"` presente
- [ ] **aria-disabled**: Se actualiza correctamente cuando disabled=true
- [ ] **tabindex**: -1 cuando disabled, 0 cuando enabled
- [ ] **Keyboard**: Enter y Space activan el botón
- [ ] **Focus Visible**: Outline visible al recibir foco
- [ ] **Disabled State**: No responde a clicks cuando está disabled
- [ ] **aria-label**: Soporta aria-label custom (si no hay texto visible)

### Tests con Lector de Pantalla
- [ ] **NVDA/JAWS (Windows)**: Anuncia "botón" y el texto del botón
- [ ] **VoiceOver (macOS)**: Anuncia correctamente el botón y estado
- [ ] **TalkBack (Android)**: Funciona en dispositivos móviles
- [ ] **Estado disabled**: Se anuncia cuando el botón está deshabilitado

### Tests de Contraste
- [ ] **Primary**: Contraste suficiente en ambos temas
- [ ] **Secondary**: Contraste suficiente en ambos temas
- [ ] **Success**: Contraste suficiente en ambos temas
- [ ] **Danger**: Contraste suficiente en ambos temas

## 🪟 PHModal Component

### Tests Específicos
- [ ] **role="dialog"**: Presente en el modal
- [ ] **aria-modal="true"**: Presente cuando está abierto
- [ ] **aria-labelledby**: Apunta al título del modal
- [ ] **aria-describedby**: Apunta al contenido (si aplica)
- [ ] **Focus Trap**: Tab y Shift+Tab no salen del modal
- [ ] **Focus Inicial**: El foco va al botón de cerrar al abrir
- [ ] **Focus Return**: El foco vuelve al trigger al cerrar
- [ ] **Escape Key**: Cierra el modal
- [ ] **Backdrop Click**: Cierra el modal (configurable)
- [ ] **Body Scroll Lock**: El body no hace scroll cuando el modal está abierto

### Tests con Lector de Pantalla
- [ ] **NVDA/JAWS**: Anuncia "diálogo" al abrir
- [ ] **VoiceOver**: Anuncia el título del modal
- [ ] **Contenido**: Todo el contenido del modal es accesible
- [ ] **Cierre**: El cierre del modal se anuncia

### Tests de Animación
- [ ] **prefers-reduced-motion**: Respeta la preferencia del usuario
- [ ] **Sin mareo**: Las animaciones no causan problemas vestibulares

## 🃏 PHCard Component

### Tests Específicos
- [ ] **Semántica**: Usa article o section apropiadamente
- [ ] **role="button"**: Solo presente cuando clickable=true
- [ ] **tabindex**: 0 cuando clickable, ausente cuando no
- [ ] **Keyboard**: Enter activa la tarjeta si es clickable
- [ ] **Slots**: Header, body y footer son accesibles
- [ ] **Headings**: Los títulos en el slot tienen nivel correcto

### Tests con Lector de Pantalla
- [ ] **NVDA/JAWS**: Lee el contenido en orden correcto
- [ ] **VoiceOver**: Los slots se anuncian correctamente
- [ ] **Clickable**: Se anuncia que la tarjeta es clickeable

## 📱 Galería (index.html)

### Tests Específicos
- [ ] **Estructura**: Header, main, footer correctos
- [ ] **Navegación**: Nav tiene aria-label
- [ ] **Búsqueda**: Input tiene label asociado
- [ ] **Grid**: Las tarjetas se organizan lógicamente
- [ ] **Links**: Todos los enlaces tienen texto descriptivo
- [ ] **Keyboard**: Toda la navegación funciona por teclado

### Tests con Lector de Pantalla
- [ ] **Landmarks**: Todas las regiones están etiquetadas
- [ ] **Headings**: Jerarquía h1 > h2 > h3 correcta
- [ ] **Búsqueda**: Se anuncia el número de resultados
- [ ] **Componentes**: Cada tarjeta de componente es navegable

## ⚡ Playground (playground.html)

### Tests Específicos
- [ ] **Editor**: Los textareas tienen labels
- [ ] **Tabs**: Implementación correcta con role="tab" y "tabpanel"
- [ ] **aria-selected**: Se actualiza al cambiar de tab
- [ ] **aria-controls**: Los tabs apuntan a sus paneles
- [ ] **Keyboard**: Arrows navegan entre tabs (opcional pero recomendado)
- [ ] **Preview iframe**: Tiene title descriptivo
- [ ] **Consola**: Usa role="log" para mensajes dinámicos
- [ ] **Botones de acción**: Todos tienen labels descriptivos

### Tests con Lector de Pantalla
- [ ] **CodeMirror**: El contenido del editor es accesible
- [ ] **Tabs**: Se anuncia el tab actual
- [ ] **Preview**: Los cambios en el preview se anuncian
- [ ] **Consola**: Los mensajes nuevos se anuncian (aria-live)
- [ ] **Atajos**: Los atajos de teclado están documentados

## 🎨 Sistema de Temas

### Tests Específicos
- [ ] **Toggle**: Accessible por teclado
- [ ] **aria-label**: Describe la acción del toggle
- [ ] **Estado**: Se indica visualmente el tema activo
- [ ] **Persistencia**: El tema se guarda en localStorage
- [ ] **prefers-color-scheme**: Respeta preferencia del sistema

### Tests de Contraste (Tema Claro)
- [ ] **Texto principal**: ≥4.5:1
- [ ] **Texto secundario**: ≥4.5:1
- [ ] **Botones**: ≥4.5:1
- [ ] **Bordes**: ≥3:1
- [ ] **Focus outline**: ≥3:1

### Tests de Contraste (Tema Oscuro)
- [ ] **Texto principal**: ≥4.5:1
- [ ] **Texto secundario**: ≥4.5:1
- [ ] **Botones**: ≥4.5:1
- [ ] **Bordes**: ≥3:1
- [ ] **Focus outline**: ≥3:1

## 🔧 Herramientas de Testing Recomendadas

### Extensiones de Navegador
- **axe DevTools**: Análisis automático de accesibilidad
- **WAVE**: Evaluación visual de accesibilidad
- **Lighthouse**: Auditoría general incluyendo accesibilidad
- **Color Contrast Analyzer**: Verificación de contraste

### Lectores de Pantalla
- **NVDA** (Windows): https://www.nvaccess.org/
- **JAWS** (Windows): https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver** (macOS/iOS): Built-in
- **TalkBack** (Android): Built-in

### Herramientas Online
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Color Review**: https://color.review/
- **Who Can Use**: https://www.whocanuse.com/

## 📝 Proceso de Testing

1. **Test Automatizado**: Ejecutar axe DevTools y Lighthouse
2. **Test de Teclado**: Navegar toda la aplicación solo con teclado
3. **Test de Lector de Pantalla**: Usar NVDA o VoiceOver
4. **Test de Zoom**: Verificar a 200% y 400%
5. **Test Mobile**: Verificar en dispositivos táctiles
6. **Test de Contraste**: Verificar todos los colores con herramientas
7. **Test de Tema**: Verificar ambos temas (claro/oscuro)
8. **Test de Motion**: Activar prefers-reduced-motion y verificar

## ✅ Criterios de Éxito

Para considerar el proyecto accesible, debe cumplir:

- [ ] **Nivel A de WCAG 2.1**: Todos los criterios obligatorios
- [ ] **Nivel AA de WCAG 2.1**: Criterios recomendados
- [ ] **0 errores críticos** en axe DevTools
- [ ] **Lighthouse Accessibility Score ≥95**
- [ ] **Navegación completa por teclado** sin mouse
- [ ] **Compatible con lectores de pantalla** principales
- [ ] **Contraste adecuado** en todos los estados
- [ ] **Responsive hasta 320px** de ancho

## 📚 Referencias

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Web.dev Accessibility](https://web.dev/accessibility/)
- [A11y Project](https://www.a11yproject.com/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**Nota**: Este checklist debe revisarse regularmente y actualizarse con cada nueva versión del proyecto.
