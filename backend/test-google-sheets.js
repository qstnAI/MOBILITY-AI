const { google } = require('googleapis');
const path = require('path');

// Configuración de Google Sheets
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'mobility-ia-2ecb9f2273a0.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function testGoogleSheets() {
  try {
    console.log('🧪 Probando conexión con Google Sheets...');
    
    const sheetId = '1C8eIB6uP0OfhyEutiYkqZjyLNL2dNmRXsWmPHUN0Yak';
    
    // Verificar autenticación
    const authClient = await auth.getClient();
    console.log('✅ Autenticación exitosa');
    
    // Intentar leer la hoja
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A1:H1',
    });
    
    console.log('✅ Lectura exitosa de Google Sheets');
    console.log('📋 Headers encontrados:', response.data.values?.[0] || []);
    
    // Intentar escribir una fila de prueba
    const testData = [
      [
        new Date().toLocaleDateString('es-ES'),
        new Date().toLocaleTimeString('es-ES'),
        'TEST',
        'Usuario de Prueba',
        'Área de Prueba',
        'Problema de prueba',
        'Solución de prueba',
        'Resultado de prueba'
      ]
    ];
    
    const writeResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:H',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: testData
      }
    });
    
    console.log('✅ Escritura exitosa en Google Sheets');
    console.log('📊 Respuesta:', writeResponse.data);
    
    console.log('🎉 ¡Todas las pruebas pasaron! Google Sheets está funcionando correctamente.');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('📋 Detalles:', error);
    
    if (error.message.includes('403')) {
      console.error('💡 Solución: Verifica que la cuenta de servicio tenga permisos de editor en el Google Sheet');
    }
    
    if (error.message.includes('404')) {
      console.error('💡 Solución: Verifica que el ID del Google Sheet sea correcto');
    }
  }
}

testGoogleSheets();

