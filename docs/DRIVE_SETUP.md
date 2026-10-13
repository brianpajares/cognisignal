# DRIVE SETUP

1. Crear un proyecto de Google Cloud y habilitar Google Drive API.
2. Crear una service account sin privilegios globales.
3. Crear/ubicar la carpeta `/Apps/cognisignal/` y compartirla con `GOOGLE_SERVICE_ACCOUNT_EMAIL` como editor solo si se usará sync; lector basta para runtime.
4. Copiar el ID de la carpeta raíz a `GOOGLE_DRIVE_FOLDER_ID`.
5. Guardar la clave privada en `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` con saltos de línea correctamente escapados en Vercel.
6. Configurar `DRIVE_CACHE_TTL_HOURS=24`.
7. Ejecutar `npm run drive:sync`: recorre `drive/`, crea subcarpetas si faltan, sube por nombre y actualiza/reemplaza archivos sin duplicados.
8. Runtime: resolver archivos del `spec/drive_manifest.json`, descargar, verificar SHA-256 y cachear metadata+contenido hasta 24 h.
9. Si Drive falla o checksum no coincide, usar únicamente la última versión cacheada que previamente pasó checksum; registrar alerta en Sentry.
10. Nunca exponer credenciales Drive al navegador.

Validación: comparar los nueve archivos del manifest, comprobar hashes y ejecutar una prueba con Drive temporalmente inaccesible.
