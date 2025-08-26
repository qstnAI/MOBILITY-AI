console.log('🔍 Prueba simple de conectividad...');

// Solo cargar el módulo sin hacer nada más
try {
  console.log('1️⃣ Cargando googleapis...');
  const { google } = require('googleapis');
  console.log('✅ googleapis cargado correctamente');
  
  console.log('2️⃣ Verificando archivo de credenciales...');
  const fs = require('fs');
  const path = require('path');
  
  const credPath = path.join(__dirname, 'mobility-ia-2ecb9f2273a0.json');
  console.log('📁 Ruta del archivo:', credPath);
  
  if (fs.existsSync(credPath)) {
    console.log('✅ Archivo de credenciales existe');
    const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    console.log('📧 Email de la cuenta de servicio:', creds.client_email);
  } else {
    console.log('❌ Archivo de credenciales no encontrado');
  }
  
  console.log('3️⃣ Intentando configuración básica...');
  const auth = new google.auth.GoogleAuth({
    keyFile: credPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  
  console.log('✅ Configuración básica completada');
  console.log('🎉 Prueba simple exitosa - el problema está en la autenticación');
  
} catch (error) {
  console.error('❌ Error en prueba simple:', error.message);
  console.error('📋 Stack:', error.stack);
}

