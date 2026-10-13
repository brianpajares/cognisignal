# Decisions log · CogniSignal

- Renombrar CogniWatch a CogniSignal por uso público/conflicto de naming; trademark y dominio siguen pendientes.
- Eliminar del MVP el claim de detección de Alzheimer 2–7 años antes.
- Target del producto: cambio cognitivo longitudinal respecto de baseline, no diagnóstico.
- Excluir GPS, keylogging, reconocimiento facial y escucha pasiva del MVP.
- Priorizar US, UK, Brazil, Mexico, Spain.
- Fase 1: email gate para informe completo + copia al dueño; Fase 2: cobro.
- LLM solo redacta; cálculo por modelo determinista/entrenado.
- Modelo principal CS-LCM v1.0: baseline personal de 6 sesiones válidas + z intraindividual + EWMA unilateral (λ=0,2; límites 2σ/3σ).
- Modelo de respaldo: Reliable Change Index, inactivo hasta disponer de SD y fiabilidad test-retest validadas para las microtareas propias.
- Se elimina del output v1 toda probabilidad clínica a 6–12 meses; clinical_probability siempre es null.
- Edad, país, idioma y educación no ajustan el score v1; se conservan para elegibilidad/localización/QA y futura validación de sesgo.
- Las tareas deben usar estímulos originales sobre jsPsych MIT; no copiar tests clínicos o baterías propietarias.
- No se usa ADNI, OCTAL, Cogstate ni TestMyBrain como dependencia de cálculo del MVP por licencia/transferibilidad/propiedad intelectual.
- Pricing fase 2 propuesto: US$39, £29, €24,99, R$99, MX$399 por informe; PPP 2025 se usa como referencia de asequibilidad, no como FX.
- La comparativa de pago v1 es contra el baseline personal; se posponen percentiles/benchmark por país hasta disponer de normas validadas.
- QA Etapa 3: brief.json queda alineado al motor observacional CS-LCM v1.0; se elimina la promesa residual de probabilidad 0–1 y horizonte clínico 6–12 meses.
- QA Etapa 3: engine_reference.py valida fecha calendario real, máximo 104 sesiones y additionalProperties=false como defensa en profundidad.
- UX: la vista previa entrega señal, índice y tendencia; el desglose por dominio/sensibilidad/metodología/plan queda tras el gate de informe.
- UX: un solo CTA por pantalla, progreso explícito y disclaimers no diagnósticos visibles en preview e informe.
- UX: sistema de diseño AA con contraste documentado y prototipo autocontenido ES/EN/PT.

## Supuestos heredados
- Usuarios 55+ pueden completar micropruebas web de 4–5 minutos.
- La repetición semanal permitirá baseline y señal longitudinal útil.
- Pricing es hipótesis y requiere test de WTP.
- EN/ES/PT requieren normalización y validación cultural.
- Existe al menos un dataset longitudinal/licenciable suficiente o, en su defecto, se lanzará un motor estadístico determinista sin claim clínico.
- Las primeras 6 sesiones válidas reflejan rendimiento habitual; el número 6 es preliminar y requiere validación prospectiva.
- Los límites EWMA son referencias estadísticas de deriva, no umbrales clínicos.
- La app aplicará exactamente el mismo scoring de microtareas en baseline y seguimiento.
- La infraestructura de pago/email/storage se seleccionará después; el margen cuantificado en etapa 2 excluye esos costes no elegidos.