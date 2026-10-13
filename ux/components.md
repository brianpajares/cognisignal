# Componentes · CogniSignal

## Botones
Primary: fondo `primary`, texto blanco, altura 48 px, radio 12, focus ring 3 px. Un solo primary visible por viewport. Secondary: fondo transparente, borde 1 px. Disabled conserva contraste y explica requisito cuando sea útil.

## Inputs
Label arriba, ayuda debajo, error inmediato. Altura mínima 48 px. Inputs numéricos usan teclado apropiado; email `autocomplete=email`. No placeholders como sustituto de labels.

## Slider
Solo para escalas subjetivas futuras; no usar para edad o métricas generadas. Debe permitir teclado y mostrar valor textual.

## Select
Native select en móvil cuando mejore accesibilidad. País e idioma separados.

## Tarjeta de resultado
Orden: etiqueta → categoría textual → índice → interpretación → contexto. La categoría nunca depende solo de color.

## Barra de señal
Horizontal 0–100, marcadores de warning/action, `aria-label` con valor y significado. Colores secundarios; texto es la fuente semántica.

## Gráfico de tendencia
SVG accesible con título, descripción y tabla alternativa. Puntos navegables por teclado en desktop; resumen textual en móvil.

## Paywall / gate
Encabezado con beneficio, lista de 4 entregables concretos, precio/email, privacidad y CTA. Sin patrones de urgencia.

## Toasts
Solo confirmaciones no críticas; errores importantes quedan inline. `aria-live=polite`.

## Skeleton
Usar solo si espera >300 ms. Respetar reduced motion.

## Modal
Evitar en flujo principal. Útil para metodología o definición; focus trap y retorno de foco obligatorio.
