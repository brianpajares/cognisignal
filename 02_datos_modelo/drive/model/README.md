# CogniSignal / model

- `engine_reference.py`: implementación de referencia pura `calculate(inputs, base) -> outputs`.
- `parameters_snapshot.json`: snapshot legible; la fuente de verdad es `base/base_cognisignal.xlsx`.
- `test_vectors.json`: 20 vectores con outputs generados ejecutando el motor contra el Excel exportado.
- No hay `train.py` en CS-LCM v1.0 porque no existe entrenamiento ni coeficientes aprendidos.
- Nunca convertir `signal_index_0_100` en probabilidad clínica.
