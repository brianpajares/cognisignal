# Cómo funciona CogniSignal

**Versión del modelo:** CS-LCM 1.0 · **Actualizado:** 2026-10-13

CogniSignal no intenta decirte si tienes Alzheimer, demencia o deterioro cognitivo leve. Su función es más acotada: observar si tu rendimiento en micropruebas breves está cambiando de forma persistente **respecto de tu propio baseline**.

## Qué mide

La app usa tres señales generadas durante las micropruebas: memoria de reconocimiento, atención/velocidad de respuesta y eficiencia ejecutiva. Los resultados se comparan contigo mismo, no con una “persona promedio” de otro país o nivel educativo.

Durante las primeras **6 sesiones válidas** se construye tu baseline. Después, cada nueva sesión se expresa en unidades de variabilidad de ese baseline. Un promedio móvil exponencial (EWMA) da más peso a lo reciente sin olvidar completamente lo anterior. Este método está documentado por NIST para detectar cambios pequeños y persistentes en series de mediciones.

Fuente del método EWMA: https://www.itl.nist.gov/div898/handbook/mpc/section2/mpc2211.htm

## Qué significa la señal

- **Stable / Estable / Estável:** la tendencia permanece dentro de la banda de referencia personal.
- **Watch / Vigilar / Observar:** la tendencia cruzó el nivel de aviso estadístico; conviene repetir en condiciones comparables.
- **Discuss with a clinician / Coméntalo con un profesional / Converse com um profissional:** la tendencia cruzó el límite de acción estadístico del motor. **No es un diagnóstico.**

El “Índice de cambio” va de 0 a 100 y muestra qué tan cerca está la tendencia del límite estadístico de acción. **100 no significa 100% de probabilidad de enfermedad.** CogniSignal v1 no calcula una probabilidad clínica.

## Por qué pedimos varias sesiones

El rendimiento cognitivo puede variar por sueño, estrés, enfermedad aguda, dispositivo, hora del día o simplemente ruido de medición. La literatura sobre evaluación cognitiva web señala que la medición repetida puede ayudar a estimar la variabilidad dentro de una persona, pero también exige control de calidad y cautela con la interpretación.

Revisión: https://pmc.ncbi.nlm.nih.gov/articles/PMC10487375/

## Qué tan confiable es

El algoritmo matemático es reproducible: la misma entrada produce siempre la misma salida, y existe una implementación de referencia en Python y Excel. Eso **no equivale** a validación clínica. En esta versión todavía no existe una cohorte prospectiva propia que permita afirmar sensibilidad, especificidad, AUC o riesgo de enfermedad para CogniSignal.

Como referencia de factibilidad, otras herramientas web longitudinales han demostrado que la evaluación cognitiva remota puede ser fiable y discriminativa, pero sus métricas no se transfieren automáticamente a CogniSignal. Por ejemplo, Brain on Track reportó AUC 0,75 y buena fiabilidad, y OCTAL reportó en 2026 AUC 0,92 para un screen de 5 minutos e ICC ≥0,79. Esos números pertenecen a esos instrumentos, no a CogniSignal.

## Límites importantes

CogniSignal puede equivocarse. Un resultado estable no descarta un problema médico. Una señal de cambio puede deberse a factores transitorios o técnicos. Si tú o tu familia observan cambios funcionales preocupantes —por ejemplo, problemas nuevos con medicación, finanzas, orientación o actividades cotidianas— busca evaluación profesional aunque la app muestre “Stable”.

No uses CogniSignal para emergencias, decisiones de capacidad legal, tratamiento, medicación ni diagnóstico.

## Datos y privacidad

El MVP no necesita GPS continuo, keylogging, cámara, micrófono pasivo, biomarcadores ni historia clínica. Debe almacenar la mínima información necesaria para seguimiento, con consentimiento, cifrado, borrado y separación entre identidad y resultados.

## Metodología en una frase

**Tu baseline → desviación por dominio → compuesto personal → EWMA → límites estadísticos 2σ/3σ → señal explicable.**

Para auditoría técnica completa, la app usa `model_spec.json`, `base_cognisignal.xlsx` y `engine_reference.py` de la misma versión.
