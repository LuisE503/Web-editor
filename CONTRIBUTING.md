# Contribuir a HTMLKit Hub

¡Gracias por tu interés en contribuir a HTMLKit Hub! Este documento proporciona directrices para contribuir al proyecto.

## 🚀 Cómo Empezar

1. **Fork el repositorio**
   ```bash
   # Haz un fork desde GitHub, luego clona tu fork
   git clone https://github.com/TU_USUARIO/htmlkit-hub.git
   cd htmlkit-hub
   ```

2. **Configura el entorno local**
   ```bash
   # Instala dependencias (opcional para linting)
   npm install
   
   # Inicia el servidor de desarrollo
   npm run dev
   ```

3. **Crea una rama para tu feature**
   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```

## 📝 Directrices de Código

### HTML
- Usa HTML5 semántico
- Incluye atributos ARIA apropiados
- Mantén la accesibilidad como prioridad
- Usa indentación de 2 espacios

### CSS
- Usa variables CSS para valores reutilizables
- Sigue la convención de nomenclatura existente
- Escribe CSS mobile-first cuando sea posible
- Agrupa propiedades relacionadas
- Comenta secciones complejas

### JavaScript
- Usa JavaScript moderno (ES6+)
- Escribe código limpio y legible
- Comenta funciones complejas
- Maneja errores apropiadamente
- Usa `const` por defecto, `let` cuando sea necesario

### Web Components
- Usa Shadow DOM para encapsulación
- Implementa atributos observables
- Incluye documentación JSDoc
- Sigue el patrón de los componentes existentes
- Asegura accesibilidad ARIA

## 🧪 Testing

Antes de enviar tu PR:

1. **Prueba manualmente**
   - Verifica en Chrome, Firefox y Safari
   - Prueba la navegación por teclado
   - Usa un lector de pantalla
   - Verifica ambos temas (claro/oscuro)

2. **Ejecuta linting**
   ```bash
   npm run lint
   ```

3. **Verifica accesibilidad**
   - Usa axe DevTools
   - Verifica contraste de colores
   - Revisa el checklist en `tests/accessibility-checklist.md`

## 📦 Tipos de Contribuciones

### 🐛 Reportar Bugs
Abre un issue con:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica
- Navegador y versión

### ✨ Nuevas Features
Antes de trabajar en una feature grande:
1. Abre un issue para discutir la idea
2. Espera feedback del mantenedor
3. Procede con la implementación

### 🎨 Nuevos Componentes
Para añadir un nuevo Web Component:
1. Crea el archivo en `components/`
2. Sigue la estructura de componentes existentes
3. Incluye Shadow DOM
4. Añade atributos configurables
5. Implementa accesibilidad ARIA
6. Documenta el componente
7. Añade ejemplos en `index.html`

### 📚 Documentación
Mejoras a la documentación son siempre bienvenidas:
- Corrige typos
- Mejora explicaciones
- Añade ejemplos
- Traduce a otros idiomas

## 🎯 Proceso de Pull Request

1. **Actualiza tu fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Haz commit de tus cambios**
   ```bash
   git add .
   git commit -m "feat: descripción clara del cambio"
   ```

   Formato de commits:
   - `feat:` nueva feature
   - `fix:` corrección de bug
   - `docs:` cambios en documentación
   - `style:` formateo, punto y coma faltantes, etc.
   - `refactor:` refactorización de código
   - `test:` añadir tests
   - `chore:` actualizar tareas de build, configuración, etc.

3. **Push a tu fork**
   ```bash
   git push origin feature/nombre-de-tu-feature
   ```

4. **Abre un Pull Request**
   - Ve a GitHub y abre un PR
   - Describe claramente los cambios
   - Referencia issues relacionados
   - Añade screenshots si hay cambios visuales

5. **Responde a feedback**
   - Los mantenedores pueden solicitar cambios
   - Haz los cambios solicitados
   - Push los cambios al mismo branch

## ✅ Checklist del PR

Antes de enviar tu PR, verifica:

- [ ] El código sigue las directrices del proyecto
- [ ] Los cambios funcionan en Chrome, Firefox y Safari
- [ ] La navegación por teclado funciona
- [ ] El código es accesible (ARIA, contraste, etc.)
- [ ] No hay errores en la consola
- [ ] El código está comentado donde es necesario
- [ ] La documentación está actualizada
- [ ] Los ejemplos funcionan correctamente
- [ ] El PR tiene una descripción clara

## 🎨 Estándares de Diseño

- **Accesibilidad**: WCAG 2.1 nivel AA mínimo
- **Responsive**: Mobile-first, funcional desde 320px
- **Temas**: Soporte para modo claro y oscuro
- **Navegación**: 100% funcional por teclado
- **Compatibilidad**: Navegadores modernos (últimas 2 versiones)

## 🆘 ¿Necesitas Ayuda?

- Abre un issue con la etiqueta `question`
- Revisa issues existentes
- Lee la documentación completa

## 📜 Código de Conducta

- Sé respetuoso y profesional
- Acepta críticas constructivas
- Enfócate en lo mejor para el proyecto
- Ayuda a otros contribuidores

## 🙏 Reconocimientos

Todos los contribuidores serán reconocidos en el README.md.

---

**¡Gracias por contribuir a HTMLKit Hub!** 🎉
