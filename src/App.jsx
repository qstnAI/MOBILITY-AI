import { useState } from "react";

export default function App() {
  // Estados para las tres pestañas
  const [activeTab, setActiveTab] = useState("ai");
  const [chat, setChat] = useState([
    {
      sender: "ai",
      text: `¡Hola! Soy Mobility AI, tu asistente digital en Mobility ADO.

Estoy aquí para apoyarte en tu día a día. ¿Cómo puedo ayudarte hoy?

Puedo ayudarte a:
• Generar ideas para mejorar procesos, productos o servicios.
• Buscar soluciones prácticas a los retos que enfrentas.
• Guiarte para estructurar y potenciar propuestas de mejora.
• Sugerir KPIs, pasos iniciales y detectar riesgos.

Cuéntame tu reto, idea o pregunta y juntos encontraremos la mejor solución.`
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Potenciador de ideas
  const [formData, setFormData] = useState({
    collaborator: "",
    area: "",
    problem: "",
    proposal: ""
  });
  const [documentationResult, setDocumentationResult] = useState("");

  // DMAMA IA
  const [dmamaForm, setDmamaForm] = useState({ area: "", descripcion: "" });
  const [dmamaResult, setDmamaResult] = useState("");

  // --- ESTILOS ---
  // Textura de líneas para el fondo
  const lineTexture =
    "repeating-linear-gradient(135deg, #ececec 0px, #ececec 1px, transparent 1px, transparent 30px)";

  // Fondos diferentes para cada herramienta
  const toolBackgrounds = {
    ai: "linear-gradient(120deg, #f8f9fa 60%, #e9e4f0 100%)",
    docu: "linear-gradient(120deg, #f0f7fa 60%, #e4f0ec 100%)",
    dmama: "linear-gradient(120deg, #f9f6fa 60%, #f0e4f8 100%)"
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: `${toolBackgrounds[activeTab]}, ${lineTexture}`,
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: 0,
      margin: 0,
      position: 'relative',
      overflowX: 'hidden',
      transition: 'background 0.3s'
    },
    header: {
      background: 'white',
      padding: '24px 0 8px 0',
      textAlign: 'center',
      borderBottom: '1px solid #ececec',
      marginBottom: '18px'
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '6px'
    },
    mainTitle: {
      color: '#632569',
      margin: 0,
      fontSize: '22px', // Más pequeño para móvil
      fontWeight: '800',
      lineHeight: '1.2',
      letterSpacing: '0.5px',
      fontFamily: "'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    tabs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '18px',
      padding: '0 4px',
      flexWrap: 'wrap'
    },
    tabButton: (active) => ({
      padding: '8px 12px',
      border: 'none',
      background: active ? '#632569' : '#f3e9f8',
      color: active ? 'white' : '#632569',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '13px',
      letterSpacing: '0.2px',
      transition: 'all 0.2s',
      outline: 'none'
    }),
    button: {
      background: '#632569',
      color: 'white',
      border: 'none',
      padding: '10px 18px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      margin: '5px',
      transition: 'all 0.2s'
    },
    refreshButton: {
      background: '#FF3131',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '8px',
      transition: 'all 0.2s'
    },
    sendButton: {
      marginLeft: '8px',
      padding: '10px 16px',
      background: '#632569',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      transition: 'all 0.2s'
    },
    card: {
      background: 'white',
      borderRadius: '16px',
      padding: '18px 8px',
      border: '1px solid #ececec',
      maxWidth: '98vw',
      margin: '0 auto'
    },
    description: {
      color: '#5a5a5a',
      fontSize: '15px',
      lineHeight: '1.5',
      marginBottom: '14px',
      textAlign: 'center'
    },
    resultCard: {
      background: '#f8f9fa',
      borderRadius: '12px',
      padding: '12px 6px',
      marginTop: '14px',
      border: '1px solid #e0e0e0'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      marginBottom: '10px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit'
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      marginBottom: '10px',
      fontSize: '14px',
      minHeight: '70px',
      resize: 'vertical',
      outline: 'none',
      fontFamily: 'inherit'
    },
    chatContainer: {
      height: '70vh',
      minHeight: '320px',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #ececec',
      overflow: 'hidden',
      maxWidth: '99vw',
      width: '100%',
      margin: '0 auto',
      position: 'relative'
    },
    chatHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 10px',
      background: '#f8f9fa',
      borderBottom: '1px solid #ececec'
    },
    chatMessages: {
      flex: 1,
      overflowY: 'auto',
      padding: '10px 4px',
      background: 'transparent'
    },
    message: (sender) => ({
      padding: '8px 10px',
      borderRadius: sender === 'ai' ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
      marginBottom: '8px',
      maxWidth: '98%',
      background: sender === 'ai' ? '#f3e9f8' : '#632569',
      color: sender === 'ai' ? '#632569' : 'white',
      marginLeft: sender === 'ai' ? '0' : 'auto',
      marginRight: sender === 'ai' ? 'auto' : '0',
      textAlign: 'left',
      fontSize: '14px',
      wordBreak: 'break-word',
      lineHeight: '1.4'
    }),
    inputContainer: {
      display: 'flex',
      padding: '10px 4px',
      borderTop: '1px solid #ececec',
      background: 'white'
    },
    chatInput: {
      flex: 1,
      padding: '10px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      outline: 'none',
      fontSize: '14px',
      fontFamily: 'inherit'
    },
    loading: {
      padding: '8px 10px',
      borderRadius: '14px',
      marginBottom: '8px',
      maxWidth: '60%',
      background: '#f3e9f8',
      color: '#632569',
      textAlign: 'left',
      fontSize: '14px'
    }
  };

  // Utilidad para convertir *texto* y **texto** en <strong> usando React
  function parseBold(text) {
    let parts = [];
    let regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      text = text.slice(lastIndex);
    } else {
      text = "";
    }
    // Ahora *asterisco simple* sobre lo que queda
    let finalParts = [];
    regex = /\*(.*?)\*/g;
    lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        finalParts.push(text.slice(lastIndex, match.index));
      }
      finalParts.push(<strong key={match.index + "_s"}>{match[1]}</strong>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      finalParts.push(text.slice(lastIndex));
    }
    return [...parts, ...finalParts];
  }

  // --- PROMPT MEJORADO PARA EL CHAT ---
  const companyContext = `
Eres Mobility AI, el asistente digital de mejora continua e innovación para los equipos internos de Mobility ADO.
Tu propósito es ayudar a los colaboradores a generar ideas, resolver retos, estructurar propuestas de mejora, sugerir KPIs, detectar riesgos y acompañar procesos de innovación.
No eres un asistente de ventas ni de atención a clientes externos, no vendes boletos ni productos.
Responde siempre de forma clara, sencilla y breve, usando títulos, viñetas y negritas cuando sea útil.
Evita lenguaje comercial o de ventas. Habla como un coach interno de innovación y mejora continua.
`;

  // --- FUNCIÓN PARA FORMATEAR RESPUESTA DEL CHAT ---
  function renderChatMessage(text) {
    // Divide por doble salto de línea para bloques
    const blocks = text.split(/\n{2,}/);
    return blocks.map((block, idx) => {
      const trimmed = block.trim();

      // Título principal: línea sola en mayúsculas o que termina en ":" y es la primera línea del bloque
      if (
        trimmed.length < 60 &&
        (
          /^[A-ZÁÉÍÓÚÑ\s]+:?$/.test(trimmed) ||
          /^[A-ZÁÉÍÓÚÑ][\w\s]+:$/.test(trimmed)
        )
      ) {
        return (
          <div key={idx} style={{ color: "#632569", fontWeight: 800, fontSize: 18, margin: "12px 0 6px 0" }}>
            {parseBold(trimmed.replace(/:$/, ""))}
          </div>
        );
      }

      // Subtítulo: línea corta que termina en ":" pero no es todo mayúsculas
      if (
        trimmed.length < 60 &&
        /^[A-ZÁÉÍÓÚÑ][\w\s]+:$/.test(trimmed) &&
        !/^[A-ZÁÉÍÓÚÑ\s]+:?$/.test(trimmed)
      ) {
        return (
          <div key={idx} style={{ color: "#632569", fontWeight: 700, fontSize: 16, margin: "10px 0 4px 0" }}>
            {parseBold(trimmed.replace(/:$/, ""))}
          </div>
        );
      }

      // Viñetas: líneas que empiezan con número, guion, asterisco, o viñeta unicode
      const bulletLines = trimmed.split('\n').filter(l => /^\s*(?:[\u2022\u25CF\u25E6\-*]|[0-9]+\.)\s+/.test(l));
      if (bulletLines.length > 0) {
        return (
          <ul key={idx} style={{ paddingLeft: 22, margin: "6px 0" }}>
            {trimmed.split('\n').map((l, i) => {
              const bulletMatch = l.match(/^\s*(?:[\u2022\u25CF\u25E6\-*]|[0-9]+\.)\s+(.*)/);
              if (bulletMatch) {
                return (
                  <li key={i} style={{ marginBottom: 4 }}>
                    {parseBold(bulletMatch[1])}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        );
      }

      // Si el bloque es una sola línea corta y toda en negritas, trátalo como subtítulo
      if (
        trimmed.length < 60 &&
        /^\*\*(.+)\*\*$/.test(trimmed)
      ) {
        return (
          <div key={idx} style={{ color: "#632569", fontWeight: 700, fontSize: 16, margin: "10px 0 4px 0" }}>
            {parseBold(trimmed)}
          </div>
        );
      }

      // Texto normal
      return (
        <div key={idx} style={{ marginBottom: 6 }}>
          {parseBold(trimmed)}
        </div>
      );
    });
  }

  // --- HANDLERS ---
  // Chat
  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    const userMessage = { sender: "user", text: message };
    setChat(prev => [...prev, userMessage]);
    setMessage("");

    try {
      const response = await fetch('https://mejora-continua-ia.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: companyContext },
            { role: "user", content: message }
          ]
        }),
      });
      if (!response.ok) throw new Error('Error de conexión');
      const data = await response.json();
      setChat(prev => [...prev, { sender: "ai", text: data.response }]);
    } catch (error) {
      setChat(prev => [...prev, { sender: "ai", text: "❌ Error: No se pudo conectar al servidor." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Potenciador de ideas
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDocumentationSubmit = async () => {
    if (!formData.collaborator || !formData.area || !formData.problem || !formData.proposal) {
      alert("Por favor, completa todos los campos");
      return;
    }
    setIsLoading(true);
    setDocumentationResult("");
    const docuContext = `
Eres MOBILITY AI, un asistente experto en innovación para Mobility ADO.
Mobility ADO es líder en movilidad y transporte en México y Latinoamérica, con enfoque en seguridad, eficiencia, experiencia del cliente y mejora continua.
Misión: Transformar la movilidad para mejorar la vida de las personas.
Visión: Ser referente en soluciones de movilidad innovadoras y sostenibles.
Valores: Innovación, trabajo en equipo, integridad, orientación al cliente y excelencia operativa.
Cultura: Colaborativa, abierta a nuevas ideas, centrada en el desarrollo del talento y la mejora constante.
Responde siempre alineado a estos principios y adapta tus respuestas al contexto de la empresa.
`;
    const prompt = `
${docuContext}
Adapta tu análisis según el área del colaborador:
- COMERCIAL → enfócate en clientes, ventas y satisfacción.
- MANTENIMIENTO → resalta eficiencia técnica y reducción de tiempos muertos.
- OPERACIONES → prioriza seguridad, puntualidad y logística.
- FINANZAS / ADMINISTRACIÓN → destaca ahorro, control y eficiencia de costos.
- RECURSOS HUMANOS → conecta con motivación, cultura y desarrollo del talento.
- Otras áreas → responde de forma clara, profesional y motivadora.
Analiza la siguiente propuesta de mejora:
👤 Colaborador: ${formData.collaborator || "No especificado"}
🏢 Área: ${formData.area || "No especificado"}
❗ Problema detectado: ${formData.problem || "No especificado"}
💡 Propuesta de mejora: ${formData.proposal || "No especificado"}
Responde en español e incluye:
1. Un breve resumen del valor de la idea.
2. 2–3 sugerencias específicas de mejora.
3. Riesgos o desafíos a considerar.
4. Pasos iniciales recomendados.
5. ✅ Un KPI (indicador de éxito) claro y medible para evaluar resultados.
Organiza visualmente tu respuesta con títulos, viñetas y negritas.
`;
    try {
      const response = await fetch('https://mejora-continua-ia.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: docuContext },
            { role: "user", content: prompt }
          ]
        }),
      });
      if (!response.ok) throw new Error('Error de conexión');
      const data = await response.json();
      setDocumentationResult(data.response);
    } catch (error) {
      setDocumentationResult("❌ Error al generar sugerencias. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // DMAMA IA
  const handleDmamaInput = (e) => {
    setDmamaForm({ ...dmamaForm, [e.target.name]: e.target.value });
  };

  const handleDmamaSubmit = async () => {
    if (!dmamaForm.area || !dmamaForm.descripcion) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    setIsLoading(true);
    setDmamaResult("");
    const prompt = `
Eres Mobility AI, el asistente oficial de Mobility ADO.
Ayuda a un equipo a estructurar su proyecto usando la metodología DMAMA (Definir, Medir, Analizar, Mejorar, Asegurar).
La información del proyecto es:
Área: ${dmamaForm.area}
Descripción de la mejora: ${dmamaForm.descripcion}

1. Redacta un planteamiento del problema (justificación) breve, profesional y claro, sin hablar de la mejora, solo del problema actual.
2. Propón una forma clara y profesional de redactar el objetivo del proyecto.
3. Sugiere 2 indicadores de éxito (KPI) potenciales y cómo medirlos.
4. Sugiere herramientas útiles para cada fase del DMAMA.
5. Sugiere cómo estructurar la información en cada slide de la presentación (una slide por cada fase).

Organiza tu respuesta en bloques visuales, usando títulos, viñetas y negritas. Sé claro, breve y directo, como si hablaras con personas sin experiencia técnica.
`;
    try {
      const response = await fetch('https://mejora-continua-ia.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "system", content: companyContext },
            { role: "user", content: prompt }
          ]
        }),
      });
      if (!response.ok) throw new Error('Error de conexión');
      const data = await response.json();
      setDmamaResult(data.response);
    } catch (error) {
      setDmamaResult("❌ Error al generar la guía. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Refrescar chat
  const refreshChat = () => {
    setChat([
      {
        sender: "ai",
        text: `¡Hola! Soy Mobility AI, tu asistente digital en Mobility ADO.

Estoy aquí para apoyarte en tu día a día. ¿Cómo puedo ayudarte hoy?

Puedo ayudarte a:
• Generar ideas para mejorar procesos, productos o servicios.
• Buscar soluciones prácticas a los retos que enfrentas.
• Guiarte para estructurar y potenciar propuestas de mejora.
• Sugerir KPIs, pasos iniciales y detectar riesgos.

Cuéntame tu reto, idea o pregunta y juntos encontraremos la mejor solución.`
      }
    ]);
  };

  // --- RENDER ---
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.titleContainer}>
          <h1 style={styles.mainTitle}>
            MOBILITY AI
          </h1>
          <p style={{ 
            color: '#666', 
            margin: '10px 0 0 0', 
            fontSize: '16px',
            lineHeight: '1.4',
            maxWidth: '350px',
            fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}>
            Genera ideas, transforma tu entorno.
          </p>
          <p style={{ 
            color: '#888', 
            margin: '6px 0 0 0', 
            fontSize: '13px', 
            fontStyle: 'italic',
            lineHeight: '1.3',
            maxWidth: '400px',
            fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}>
            Herramienta potenciada con OpenAI para equipos de mejora continua en MOBILITY ADO.
          </p>
        </div>
      </header>

      <div style={styles.tabs}>
        <button 
          style={styles.tabButton(activeTab === "ai")}
          onClick={() => setActiveTab("ai")}
        >
          🤖 MOBILITY AI
        </button>
        <button 
          style={styles.tabButton(activeTab === "docu")}
          onClick={() => setActiveTab("docu")}
        >
          🚀 Potenciador de Ideas
        </button>
        <button 
          style={styles.tabButton(activeTab === "dmama")}
          onClick={() => setActiveTab("dmama")}
        >
          📊 DMAMA IA
        </button>
      </div>

      <main style={{ padding: '10px', position: 'relative', zIndex: 1 }}>
        {/* TAB 1: MOBILITY AI */}
        {activeTab === "ai" && (
          <div style={styles.chatContainer}>
            {/* Quitamos el encabezado */}
            <div style={styles.chatMessages}>
              {chat.map((msg, i) => (
                <div key={i} style={styles.message(msg.sender)}>
                  {msg.sender === "ai"
                    ? renderChatMessage(msg.text)
                    : msg.text}
                </div>
              ))}
              {isLoading && (
                <div style={styles.loading}>
                  ⏳ Pensando...
                </div>
              )}
            </div>
            <div style={styles.inputContainer}>
              <input 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Escribe tu idea o pregunta..." 
                style={styles.chatInput}
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) sendMessage();
                }}
              />
              <button 
                onClick={sendMessage} 
                style={{
                  ...styles.sendButton,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Enviar"}
              </button>
              <button 
                style={{
                  ...styles.refreshButton,
                  marginLeft: 8
                }}
                onClick={refreshChat}
                title="Comenzar nuevo chat"
                disabled={isLoading}
              >
                🔄
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: POTENCIADOR DE IDEAS */}
        {activeTab === "docu" && (
          <div style={styles.card}>
            <div style={styles.description}>
              <h3 style={{ color: '#632569', marginBottom: '10px', fontSize: '20px' }}>🚀 Potenciador de Ideas</h3>
              <p>
                Lleva tus iniciativas a otro nivel. Descubre ángulos y enfoques nuevos para transformar ideas en proyectos ejecutables.
              </p>
            </div>
            <input 
              name="collaborator"
              value={formData.collaborator}
              onChange={handleInputChange}
              placeholder="Nombre del colaborador" 
              style={styles.input}
              disabled={isLoading}
            />
            <input 
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              placeholder="Área o departamento" 
              style={styles.input}
              disabled={isLoading}
            />
            <textarea 
              name="problem"
              value={formData.problem}
              onChange={handleInputChange}
              placeholder="Describe el problema o oportunidad" 
              style={styles.textarea}
              disabled={isLoading}
            />
            <textarea 
              name="proposal"
              value={formData.proposal}
              onChange={handleInputChange}
              placeholder="Propuesta de solución o idea inicial" 
              style={styles.textarea}
              disabled={isLoading}
            />
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={handleDocumentationSubmit} 
                style={{
                  ...styles.button,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={isLoading}
              >
                {isLoading ? "🔄 Potenciando..." : "🚀 Potenciar Idea"}
              </button>
              <button
                onClick={() => setDocumentationResult("")}
                style={{
                  ...styles.refreshButton,
                  marginLeft: 12
                }}
                disabled={isLoading}
              >
                Limpiar
              </button>
            </div>
            {documentationResult && (
              <div style={styles.resultCard}>
                <h3 style={{ color: '#632569', marginTop: 0, fontSize: '17px' }}>💡 Análisis Potenciado:</h3>
                <div style={{ lineHeight: '1.6', fontSize: '15px' }}>
                  {renderChatMessage(documentationResult)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DMAMA IA */}
        {activeTab === "dmama" && (
          <div style={styles.card}>
            <div style={styles.description}>
              <h3 style={{ color: '#632569', marginBottom: '10px', fontSize: '20px' }}>📊 Guía DMAMA para Proyectos</h3>
              <p>
                Completa los campos y genera una guía para estructurar tu proyecto con la metodología DMAMA.
              </p>
            </div>
            <input
              name="area"
              value={dmamaForm.area}
              onChange={handleDmamaInput}
              placeholder="Área o departamento"
              style={styles.input}
              disabled={isLoading}
            />
            <textarea
              name="descripcion"
              value={dmamaForm.descripcion}
              onChange={handleDmamaInput}
              placeholder="Descripción breve de la mejora"
              style={styles.textarea}
              disabled={isLoading}
            />
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleDmamaSubmit}
                style={{
                  ...styles.button,
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={isLoading}
              >
                {isLoading ? "Generando..." : "Generar Guía"}
              </button>
              <button
                onClick={() => setDmamaResult("")}
                style={{
                  ...styles.refreshButton,
                  marginLeft: 12
                }}
                disabled={isLoading}
              >
                Limpiar
              </button>
            </div>
            {dmamaResult && (
              <div style={styles.resultCard}>
                <h3 style={{ color: '#632569', marginTop: 0, fontSize: '17px' }}>Guía para tu proyecto DMAMA</h3>
                <div style={{ lineHeight: '1.6', fontSize: '15px' }}>
                  {
                    (() => {
                      // Agrupa bloques por títulos (líneas que terminan en ":")
                      const lines = dmamaResult.split('\n');
                      let blocks = [];
                      let currentBlock = { title: null, content: [], color: "#e0e7ff" };
                      // Paleta de colores suave y ejecutiva
                      const blockColors = [
                        "#e0e7ff", "#ffe4e6", "#fef9c3", "#d1fae5", "#f3e8ff", "#f1f5f9"
                      ];
                      let colorIdx = 0;

                      lines.forEach(line => {
                        const clean = line.trim();
                        if (!clean) return;
                        // Detecta títulos (líneas que terminan en ":")
                        if (/^[\wÁÉÍÓÚÑáéíóúüÜ\s]+:$/i.test(clean)) {
                          // Si hay bloque anterior, lo guarda
                          if (currentBlock.title || currentBlock.content.length > 0) {
                            blocks.push({ ...currentBlock });
                            colorIdx = (colorIdx + 1) % blockColors.length;
                          }
                          currentBlock = {
                            title: clean.replace(/:$/, ""),
                            content: [],
                            color: blockColors[colorIdx]
                          };
                        } else {
                          currentBlock.content.push(line);
                        }
                      });
                      // Agrega el último bloque
                      if (currentBlock.title || currentBlock.content.length > 0) {
                        blocks.push({ ...currentBlock });
                      }

                      // Renderiza todos los bloques, sin omitir ninguno
                      return blocks.map((block, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: block.color,
                            borderRadius: 12,
                            padding: "16px 18px",
                            marginBottom: 14,
                            boxShadow: "none",
                            border: "none"
                          }}
                        >
                          {block.title && (
                            <div style={{
                              color: "#632569",
                              fontWeight: 800,
                              fontSize: '16px',
                              marginBottom: 6
                            }}>
                              {block.title.replace(/slide/gi, "Diapositiva")}
                            </div>
                          )}
                          <div>
                            {block.content.map((l, i) => {
                              // Reemplaza "slide" por "diapositiva" en el contenido también
                              const lineWithDiapositiva = l.replace(/slide/gi, "diapositiva");
                              // Viñetas
                              if (/^\s*[\-\*]\s+/.test(lineWithDiapositiva)) {
                                return (
                                  <ul key={i} style={{ paddingLeft: 18, margin: 0 }}>
                                    <li style={{ marginBottom: 4 }}>{parseBold(lineWithDiapositiva.replace(/^\s*[\-\*]\s+/, ""))}</li>
                                  </ul>
                                );
                              }
                              // Texto normal
                              return (
                                <div key={i} style={{ marginBottom: 4 }}>
                                  {parseBold(lineWithDiapositiva)}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ));
                    })()
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}