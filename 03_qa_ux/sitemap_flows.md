# Sitemap, rutas y flujos · CogniSignal

## Sitemap
- `/` Landing
- `/evaluacion/edad`
- `/evaluacion/pais`
- `/evaluacion/contexto`
- `/evaluacion/prueba/:task`
- `/procesando`
- `/resultado`
- `/informe/solicitar`
- `/checkout` (Fase 2)
- `/informe/listo`
- `/informe/:report_id`
- `/como-funciona`
- `/faq`
- `/legal/privacidad`
- `/legal/terminos`
- `/legal/aviso-medico`
- `/admin`
- SEO país: `/us/cognitive-change-tracker`, `/uk/cognitive-change-tracker`, `/es/seguimiento-cognitivo`, `/br/acompanhamento-cognitivo`, `/mx/seguimiento-cognitivo`
- SEO casos de uso: `/uso/memory-change-tracking`, `/uso/attention-change-tracking`, `/uso/personal-cognitive-baseline`

## Flujo principal
```mermaid
flowchart TD
A[Landing] --> B[Contexto breve]
B --> C[Micropruebas]
C --> D{¿6 sesiones válidas?}
D -- No --> E[Progreso de baseline]
E --> A2[Volver en próxima sesión]
D -- Sí --> F[Procesando]
F --> G[Vista previa]
G --> H[Solicitar informe]
H --> I{Fase de monetización}
I -- Validación --> J[Email + consentimiento]
I -- Cobro activo --> K[Checkout]
J --> L[Éxito]
K --> L
L --> M[Informe]
```

## Flujo de seguridad
```mermaid
flowchart TD
R[Resultado] --> Q{Calidad suficiente}
Q -- No --> X[No puntuar + explicar por qué]
Q -- Sí --> C{Categoría}
C -- Stable --> S[Repetir según cadencia]
C -- Watch --> W[Repetir + revisar contexto]
C -- Discuss --> D[Considerar hablar con profesional]
D --> N[Disclaimer: no diagnóstico]
```

## Reglas SEO
Las páginas SEO nunca deben prometer diagnóstico, prevención ni detección de Alzheimer. Canonical por locale, `hreflang` ES/EN/PT, contenido local real y precios solo cuando Fase 2 esté activa.
