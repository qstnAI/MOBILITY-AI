// Backend básico en Node.js + Express para conectar tu frontend con OpenAI
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
const { google } = require('googleapis');
const fs = require("fs");
const path = require("path");
const config = require('./config');
require("dotenv").config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuración de Google Sheets
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: "mobility-ia",
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
    universe_domain: "googleapis.com"
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Función para guardar datos en Google Sheets
const saveToGoogleSheets = async (data, sheetId) => {
  try {
    console.log("🔄 Preparando datos para Google Sheets:", data);
    
    // Preparar los datos para Google Sheets
    const values = data.map(row => [
      row['Fecha'],
      row['Hora'],
      row['Tipo'],
      row['Colaborador'],
      row['Área'],
      row['Problema/Oportunidad'] || row['Descripción de la Mejora'],
      row['Propuesta de Solución'] || '',
      row['Resultado IA']
    ]);

    console.log("📊 Valores a enviar:", values);

    // Agregar fila a la hoja
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:H', // Columnas A-H
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: values
      }
    });

    console.log("📈 Respuesta de Google Sheets:", response.data);
    console.log(`✅ Datos guardados en Google Sheets: ${sheetId}`);
    return true;
  } catch (error) {
    console.error("❌ Error guardando en Google Sheets:", error);
    console.error("❌ Detalles del error:", error.message);
    return false;
  }
};

// Endpoint DMAMA IA - PARA CHAT NORMAL (con foco en innovación Mobility ADO)
app.post("/api/dmama", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "El prompt es requerido." });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `Eres Mobility AI, el asistente especializado en innovación y mejora continua de Mobility ADO.

CONTEXTO MOBILITY ADO:
• Líder en movilidad en México y Latinoamérica
• Misión: "Mejoramos la calidad de vida a través de la movilidad"
• Valores: seguridad, eficiencia, innovación, sostenibilidad
• Enfoque: hacer que los viajes sean accesibles para todos

TU PROPÓSITO:
Ayudar a colaboradores a desarrollar ideas, resolver retos y potenciar la innovación dentro de Mobility ADO.

ÁREAS EN LAS QUE ESPECIALMENTE PUEDES AYUDAR:
✅ Generación de ideas para mejorar procesos, productos o servicios
✅ Análisis de retos operativos y propuestas de solución
✅ Estructuración de propuestas de mejora e innovación
✅ Sugerencia de KPIs e indicadores para medir impacto
✅ Detección de riesgos y oportunidades de mejora
✅ Orientación sobre metodologías de innovación (DMAMA, etc.)
✅ Colaboración entre áreas para mejores resultados

ESTILO DE RESPUESTA:
• Conversacional pero profesional
• Usa emojis moderadamente 😊
• Sé práctico y orientado a soluciones
• Cuando sea relevante, sugiere KPIs, métricas o datos necesarios
• Fomenta la innovación y mejora continua
• Adapta tu respuesta al área del colaborador (operaciones, mantenimiento, comercial, etc.)

EJEMPLOS DE RESPUESTAS ADECUADAS:
"¡Excelente idea! Para medir su impacto podríamos considerar estos KPIs..."
"Ese reto operativo es interesante. Te sugiero analizar estos datos..."
"Para tu propuesta de innovación, necesitaríamos definir estos indicadores..."
"¿Has considerado colaborar con el área de X para fortalecer tu idea?"

Sé el coach de innovación que los colaboradores de Mobility ADO necesitan.` 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    res.json({ response: completion.choices[0].message.content });
    
  } catch (err) {
    console.error("Error en /api/dmama:", err.response?.data || err.message);
    res.status(500).json({ error: "Error al conectar con OpenAI" });
  }
});

// Endpoint CHAT - PARA FORMATOS ESTRUCTURADOS (Potenciador de Ideas)
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.some(msg => typeof msg.content !== "string" || msg.content.trim() === "")) {
    return res.status(400).json({ error: "Todos los mensajes deben tener contenido válido." });
  }

  const systemPrompt = {
    role: "system",
    content: `Eres MOBILITY AI, experto en innovación y mejora continua de Mobility ADO.

FORMATO ESTRICTO PARA PROPUESTAS DE INNOVACIÓN:

RESUMEN DEL VALOR DE LA IDEA
- [Breve descripción del valor principal y impacto esperado]

SUGERENCIAS DE MEJORA  
- [Sugerencia 1 con enfoque práctico]
- [Sugerencia 2 para potenciar la idea]
- [Sugerencia 3 de implementación]

RIESGOS O DESAFÍOS A CONSIDERAR
- [Riesgo principal y mitigación sugerida]
- [Desafío operativo y solución propuesta]

PASOS INICIALES RECOMENDADOS
- [Paso 1 concreto y accionable]
- [Paso 2 para validación temprana]
- [Paso 3 de implementación inicial]

KPI CLARO Y MEDIBLE PARA EVALUAR RESULTADOS
- [KPI principal con fórmula de cálculo si es aplicable]
- [Meta sugerida y periodicidad de medición]

COLABORACIÓN INTERÁREAS RECOMENDADA
- [Área 1 que podría enriquecer la propuesta]
- [Área 2 para implementación conjunta]

Incluye datos, métricas y KPIs relevantes. Sé específico y accionable.`
  };

  const newMessages = messages[0]?.role === "system"
    ? [systemPrompt, ...messages.slice(1)]
    : [systemPrompt, ...messages];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: newMessages,
      temperature: 0.4,
      max_tokens: 800
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error("Error en /api/chat:", err.response?.data || err.message);
    res.status(500).json({ error: "Error al conectar con OpenAI" });
  }
});

// Endpoint para DocuIA específico
app.post("/api/docuia", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "El prompt es requerido." });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `Eres Mobility AI, experto en metodología DMAMA para documentación de ideas innovadoras.

FORMATO PARA DOCUMENTACIÓN DMAMA:

1. PLANTEAMIENTO DEL PROBLEMA
- [Contexto del problema con datos relevantes si se disponen]
- [Impacto actual del problema en operaciones o experiencia]

2. OBJETIVO DEL PROYECTO  
- [Objetivo SMART específico]
- [Resultado esperado cuantificable]

3. INDICADORES DE ÉXITO
- [KPI 1: fórmula, meta y periodicidad]
- [KPI 2: métrica de impacto cuantificable]
- [KPI 3: indicador de proceso o calidad]

4. HERRAMIENTAS ÚTILES
- [Herramienta 1: aplicación práctica y beneficios]
- [Herramienta 2: cómo implementarla en Mobility ADO]
- [Herramienta 3: integración con sistemas existentes]

5. TIPS POR FASE DMAMA
- DEFINIR: [Cómo enfocar el problema en contexto Mobility ADO]
- MEDIR: [Qué datos recolectar y cómo obtenerlos]
- ANALIZAR: [Técnicas para identificar causas raíz]  
- MEJORAR: [Cómo generar and seleccionar soluciones innovadoras]
- ASEGURAR: [Estandarización y seguimiento en la organización]

Incluye métricas, KPIs y datos específicos cuando sea relevante.` 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 700
    });
    res.json({ response: completion.choices[0].message.content });
  } catch (err) {
    console.error("Error en /api/docuia:", err.response?.data || err.message);
    res.status(500).json({ error: "Error al conectar con OpenAI" });
  }
});

// Endpoint para guardar datos automáticamente en Google Sheets con logging
app.post("/api/save-data", async (req, res) => {
  const { type, data } = req.body;
  
  console.log("📝 Recibiendo datos para guardar:", { type, data });
  
  if (!type || !data) {
    console.log("❌ Datos faltantes:", { type, data });
    return res.status(400).json({ error: "Tipo y datos son requeridos" });
  }

  try {
    let formattedData;
    const sheetId = config.GOOGLE_SHEET_ID; // ID de tu Google Sheet

    console.log("🔗 Google Sheet ID:", sheetId);

    if (!sheetId) {
      console.log("❌ Google Sheet ID no configurado");
      return res.status(500).json({ error: "Google Sheet ID no configurado" });
    }

    if (type === 'potenciador') {
      formattedData = [{
        'Fecha': new Date().toLocaleDateString('es-ES'),
        'Hora': new Date().toLocaleTimeString('es-ES'),
        'Tipo': 'Potenciador de Ideas',
        'Colaborador': data.collaborator,
        'Área': data.area,
        'Problema/Oportunidad': data.problem,
        'Propuesta de Solución': data.proposal,
        'Resultado IA': data.result || 'No generado'
      }];
    } else if (type === 'docuia') {
      formattedData = [{
        'Fecha': new Date().toLocaleDateString('es-ES'),
        'Hora': new Date().toLocaleTimeString('es-ES'),
        'Tipo': 'DocuIA DMAMA',
        'Colaborador': data.colaborador,
        'Área': data.area,
        'Descripción de la Mejora': data.descripcion,
        'Resultado IA': data.result || 'No generada'
      }];
    } else {
      return res.status(400).json({ error: "Tipo no válido" });
    }

    const success = await saveToGoogleSheets(formattedData, sheetId);
    
    if (success) {
      res.json({ 
        success: true, 
        message: "Datos guardados automáticamente en Google Sheets",
        sheetId: sheetId
      });
    } else {
      res.status(500).json({ error: "Error al guardar datos en Google Sheets" });
    }
  } catch (error) {
    console.error("Error en /api/save-data:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Endpoint de prueba para Google Sheets
app.get("/api/test-sheets", async (req, res) => {
  try {
    const sheetId = config.GOOGLE_SHEET_ID;
    console.log("Testing Google Sheets with ID:", sheetId);
    
    // Intentar leer la hoja para verificar permisos
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A1:H1',
    });
    
    res.json({ 
      success: true, 
      message: "Google Sheets conectado correctamente",
      sheetId: sheetId,
      headers: response.data.values?.[0] || []
    });
  } catch (error) {
    console.error("Error testing Google Sheets:", error);
    res.status(500).json({ 
      error: "Error conectando con Google Sheets", 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Servidor funcionando correctamente",
    endpoints: {
      dmama: "Chat general de innovación",
      chat: "Formatos estructurados para propuestas",
      docuia: "Documentación DMAMA",
      saveData: "Guardar datos automáticamente",
      testSheets: "Probar conexión con Google Sheets"
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles:`);
  console.log(`   POST /api/dmama    - Chat de innovación general (gpt-4o-mini)`);
  console.log(`   POST /api/chat     - Propuestas estructuradas con KPIs (gpt-4o-mini)`);
  console.log(`   POST /api/docuia   - Documentación DMAMA con métricas (gpt-4o-mini)`);
  console.log(`   GET  /health       - Health check`);
});