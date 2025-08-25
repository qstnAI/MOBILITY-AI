# Configuración de Google Sheets

## Pasos para configurar Google Sheets:

### 1. Crear un proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Sheets

### 2. Crear una cuenta de servicio
1. En Google Cloud Console, ve a "IAM & Admin" > "Service Accounts"
2. Crea una nueva cuenta de servicio
3. Descarga el archivo JSON de credenciales
4. Renombra el archivo a `credentials.json` y colócalo en la carpeta `backend/`

### 3. Crear un Google Sheet
1. Ve a [Google Sheets](https://sheets.google.com/)
2. Crea una nueva hoja de cálculo
3. Comparte la hoja con la cuenta de servicio (email que aparece en credentials.json)
4. Copia el ID de la hoja de la URL (la parte entre /d/ y /edit)

### 4. Configurar variables de entorno
En tu archivo `.env` o en las variables de entorno de Render, agrega:
```
GOOGLE_SHEET_ID=tu-sheet-id-aqui
```

### 5. Estructura del Google Sheet
El sheet debe tener estas columnas en la primera fila:
- A: Fecha
- B: Hora  
- C: Tipo
- D: Colaborador
- E: Área
- F: Problema/Oportunidad
- G: Propuesta de Solución
- H: Resultado IA

### 6. Permisos
Asegúrate de que la cuenta de servicio tenga permisos de "Editor" en el Google Sheet.

## Notas importantes:
- El archivo `credentials.json` NO debe subirse a Git
- Agrega `credentials.json` a tu `.gitignore`
- En producción (Render), usa variables de entorno para las credenciales
