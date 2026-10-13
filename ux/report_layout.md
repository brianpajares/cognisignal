# Layout del informe PDF · CogniSignal

## Página 1 · Resumen
Marca, fecha, `report_id`, versión del motor, categoría textual, Índice de Cambio, frase interpretativa y disclaimer visible: “No es un diagnóstico ni una probabilidad de enfermedad”.

## Página 2 · Tu tendencia
Gráfico temporal de compuesto/EWMA, límites warning/action con etiquetas, sesiones válidas/excluidas y notas de contexto.

## Página 3 · Qué cambió
Tabla por memoria, atención y función ejecutiva: valor reciente, baseline, z personal y dirección. Incluir dominio excluido si SD insuficiente.

## Página 4 · Sensibilidad
Escenarios +1 SD peor por dominio y variación del índice. Explicar que es prueba de sensibilidad matemática, no pronóstico.

## Página 5 · Supuestos y calidad
Tabla: baseline=6 (preliminar), min_domains=2 (preliminar), λ=0.2, límites 2σ/3σ, dispositivo/navegador si existe, calidad de sesión.

## Página 6 · Metodología
Baseline personal → z intraindividual → compuesto → EWMA. Fuentes metodológicas y versión exacta del motor.

## Página 7 · Próximos pasos
Stable: mantener cadencia. Watch: repetir en condiciones comparables y revisar sueño/estrés/enfermedad/cambio de medicación. Discuss: considerar compartir el informe con un profesional. Nunca recomendar tratamiento.

## Página 8 · Privacidad, límites y verificación
Datos usados, retención, derechos, disclaimer, `verification_id` y checksum corto del payload canónico. QR opcional solo a página de verificación sin PII.
