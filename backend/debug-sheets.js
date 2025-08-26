const { google } = require('googleapis');
const path = require('path');

console.log('🔍 Iniciando debug de Google Sheets...');

async function debugGoogleSheets() {
  try {
    console.log('1️⃣ Cargando módulos...');
    
    console.log('2️⃣ Configurando autenticación...');
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, 'mobility-ia-2ecb9f2273a0.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    console.log('3️⃣ Obteniendo cliente de autenticación...');
    const authClient = await auth.getClient();
    console.log('✅ Cliente de autenticación obtenido');
    
    console.log('4️⃣ Configurando Google Sheets API...');
    const sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets API configurado');
    
    console.log('5️⃣ Intentando leer Google Sheet...');
    const sheetId = '1C8eIB6uP0OfhyEutiYkqZjyLNL2dNmRXsWmPHUN0Yak';
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A1:H1',
    });
    
    console.log('✅ Lectura exitosa!');
    console.log('📋 Headers:', response.data.values?.[0] || []);
    
  } catch (error) {
    console.error('❌ Error en el debug:', error.message);
    console.error('📋 Tipo de error:', error.constructor.name);
    
    if (error.code) {
      console.error('🔢 Código de error:', error.code);
    }
    
    if (error.status) {
      console.error('📊 Status:', error.status);
    }
    
    console.error('📄 Stack trace:', error.stack);
  }
}

console.log('🚀 Ejecutando debug...');
debugGoogleSheets().then(() => {
  console.log('🏁 Debug completado');
}).catch((error) => {
  console.error('💥 Error fatal:', error);
});

