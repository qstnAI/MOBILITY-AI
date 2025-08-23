import { useState, useEffect } from "react";

export default function App() {
  // Estados principales
  const [activeTab, setActiveTab] = useState("ai");
  // Estado para DocuIA
  const [dmamaForm, setDmamaForm] = useState({ colaborador: '', area: '', descripcion: '' });
  const [dmamaResult, setDmamaResult] = useState('');
  const [isLoadingDmama, setIsLoadingDmama] = useState(false);
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


  // Estilos (puedes personalizar)
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: 0,
      margin: 0,
    },
    header: {
      background: 'white',
      padding: '16px 0 8px 0',
      textAlign: 'center',
      marginBottom: '12px',
      boxShadow: '0 2px 16px 0 rgba(99,37,105,0.06)',
    },
    mainTitle: {
      color: '#632569',
      margin: 0,
      fontSize: '22px',
      fontWeight: '900',
      lineHeight: '1.1',
      marginBottom: '28px',
      padding: '0 4px',
      flexWrap: 'wrap',
    },
    tabButton: (active) => ({
      padding: '10px 22px',
      border: 'none',
      background: active ? 'linear-gradient(90deg, #632569 60%, #a084b6 100%)' : '#f3e9f8',
      color: active ? 'white' : '#632569',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: 700,
      fontSize: '15px',
      letterSpacing: '0.2px',
      transition: 'all 0.18s',
      outline: 'none',
      boxShadow: active ? '0 2px 8px 0 rgba(99,37,105,0.10)' : 'none',
      borderBottom: active ? '2.5px solid #a084b6' : '2.5px solid transparent',
    }),
    bubbleAI: {
      alignSelf: 'flex-start',
      background: '#632569',
      color: 'white',
      borderRadius: '14px',
      padding: '10px 18px',
      maxWidth: '80%',
      boxShadow: '0 4px 18px 0 rgba(99,37,105,0.13)',
      fontSize: '15px',
      marginBottom: 10,
      fontWeight: 400,
      position: 'relative',
      zIndex: 1,
    },
    bubbleUser: {
      alignSelf: 'flex-end',
      background: '#a084b6',
      color: 'white',
      borderRadius: '14px',
      padding: '10px 18px',
      maxWidth: '80%',
      boxShadow: '0 4px 18px 0 rgba(99,37,105,0.10)',
      fontSize: '15px',
      marginBottom: 10,
      fontWeight: 400,
      position: 'relative',
      zIndex: 1,
    },
  };

  // Helpers
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

  // Renderizado de mensajes AI
  function renderChatMessage(text) {
    const blocks = text.split(/\n{2,}/);
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
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
      // Viñetas
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
      // Texto normal
      return (
        <div key={idx} style={{ marginBottom: 6 }}>
          {parseBold(trimmed)}
        </div>
      );
    });
  }

  // Formateo visual para el resultado del Potenciador de Ideas (títulos en negritas reales)
  function renderDocuResult(text) {
    if (!text) return null;
    // Divide por líneas
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const blocks = [];
    let currentTitle = null;
    let currentList = [];
    // Títulos reconocidos
    const titleRegex = /^(RESUMEN DEL VALOR DE LA IDEA|SUGERENCIAS DE MEJORA|RIESGOS O DESAFÍOS A CONSIDERAR|PASOS INICIALES RECOMENDADOS|✅ KPI CLARO Y MEDIBLE PARA EVALUAR RESULTADOS)$/i;
    let afterTitle = false;
    let lastTitle = '';
    lines.forEach(line => {
      // Elimina asteriscos, gatos y otros símbolos especiales
      const cleanLine = line.replace(/[\*#]+/g, '').trim();
      if (titleRegex.test(cleanLine)) {
        if (currentList.length) {
          blocks.push(<div style={{ margin: '8px 0 12px 0', paddingLeft: 12 }}>{currentList}</div>);
          currentList = [];
        }
        currentTitle = cleanLine.toUpperCase();
        lastTitle = currentTitle;
        blocks.push(<div style={{ fontWeight: 900, color: '#632569', fontSize: 17, margin: '16px 0 4px 0', letterSpacing: 0.5 }}>{currentTitle}</div>);
        afterTitle = true;
      } else if (/^[-•]/.test(cleanLine)) {
        currentList.push(<div style={{ marginBottom: 4 }}>- {cleanLine.replace(/^[-•]\s*/, '')}</div>);
        afterTitle = false;
      } else if (cleanLine) {
        if (afterTitle) {
          // Si es la primera línea después de un título, solo poner viñeta si NO es el resumen
          if (lastTitle === 'RESUMEN DEL VALOR DE LA IDEA') {
            currentList.push(<div style={{ marginBottom: 4 }}>{cleanLine}</div>);
          } else {
            currentList.push(<div style={{ marginBottom: 4 }}>- {cleanLine}</div>);
          }
          afterTitle = false;
        } else {
          if (currentList.length) {
            blocks.push(<div style={{ margin: '8px 0 12px 0', paddingLeft: 12 }}>{currentList}</div>);
            currentList = [];
          }
          blocks.push(<div style={{ marginBottom: 6 }}>{cleanLine}</div>);
        }
      }
    });
    if (currentList.length) {
      blocks.push(<div style={{ margin: '8px 0 12px 0', paddingLeft: 12 }}>{currentList}</div>);
    }
    return blocks;
  }

  // Prompts
  const companyContext = `Eres Mobility AI, el asistente digital de mejora continua e innovación para los equipos internos de Mobility ADO.
Tu propósito es ayudar a los colaboradores a generar ideas, resolver retos, estructurar propuestas de mejora, sugerir KPIs, detectar riesgos y acompañar procesos de innovación.
No eres un asistente de ventas ni de atención a clientes externos, no vendes boletos ni productos.
Responde siempre de forma clara, sencilla y breve, usando títulos, viñetas y negritas cuando sea útil.
Evita lenguaje comercial o de ventas. Habla como un coach interno de innovación y mejora continua.

Misión de MobilityADO: "Mejoramos la calidad de vida a través de la movilidad".

QUEREMOS:
• Hacer que todos los viajes sean fáciles y accesibles
• Promover la educación sobre movilidad
• Compartir información para acelerar nuestro éxito comercial
• Buscar el avance humano al construir comunidades
• Hacer que disfrutes todos tus viajes
• Que menos sea más
• Ser parte del futuro de los diferentes modos de transporte

La colaboración entre áreas es fundamental para el éxito de cualquier iniciativa. Si consideras que para resolver un reto o potenciar una idea sería útil involucrar a otra área o equipo, sugiere explícitamente cuál podría ser y por qué, para fomentar el trabajo conjunto y mejores resultados.
`;

  const docuContext = `Eres MOBILITY AI, asistente experto en innovación de Mobility ADO (líder en movilidad y transporte en México y Latinoamérica).
Principios clave: seguridad, eficiencia, experiencia del cliente, innovación, mejora continua, sostenibilidad y cultura colaborativa.
Instrucciones:
Responde siempre alineado con misión, visión, valores y cultura de la empresa.
Adapta tu análisis según el área:
Comercial → clientes, ventas, satisfacción.
Mantenimiento → eficiencia técnica, reducción de tiempos muertos.
Operaciones → seguridad, puntualidad, logística.
Finanzas/Administración → ahorro, control, eficiencia de costos.
Recursos Humanos → motivación, cultura, desarrollo del talento.
Otras áreas → claridad, profesionalismo, motivación.

FORMATO ESTRICTO DE RESPUESTA (NO uses asteriscos, ni gatos, ni símbolos especiales para títulos o negritas. Los títulos deben ir al inicio de cada sección, en mayúsculas, y claramente diferenciados. Usa viñetas simples para listas):

RESUMEN DEL VALOR DE LA IDEA
- (Breve descripción)

SUGERENCIAS DE MEJORA
- Sugerencia 1
- Sugerencia 2
- Sugerencia 3

RIESGOS O DESAFÍOS A CONSIDERAR
- Riesgo o desafío 1
- Riesgo o desafío 2

PASOS INICIALES RECOMENDADOS
- Paso 1
- Paso 2
- Paso 3

✅ KPI CLARO Y MEDIBLE PARA EVALUAR RESULTADOS
- KPI sugerido

EJEMPLO DE FORMATO:
RESUMEN DEL VALOR DE LA IDEA
- Esta propuesta ayuda a mejorar la eficiencia y la experiencia del cliente.
SUGERENCIAS DE MEJORA
- Implementar capacitación.
- Medir resultados mensualmente.
- Involucrar a otras áreas clave.
RIESGOS O DESAFÍOS A CONSIDERAR
- Resistencia al cambio.
- Falta de recursos.
PASOS INICIALES RECOMENDADOS
- Presentar la idea al equipo.
- Definir responsables.
- Medir resultados.
✅ KPI CLARO Y MEDIBLE PARA EVALUAR RESULTADOS
- % de reducción de tiempos o errores.

NO respondas de otra forma ni mezcles los apartados en un solo párrafo. Si no puedes cumplir el formato, responde: "No puedo cumplir el formato solicitado".`;

  // Handlers principales (debes adaptar las URLs a tu backend si es necesario)
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
    const prompt = `
${docuContext}
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

  // Frases motivacionales para la barra
  const motivationalPhrases = [
    "La innovación distingue a los líderes de los seguidores.",
    "Colaborar es multiplicar el impacto.",
    "Cada reto es una oportunidad para mejorar.",
    "El futuro de la movilidad lo creamos juntos.",
    "Atrévete a proponer, comparte y transforma.",
    "El liderazgo empieza con una idea y se consolida con acción.",
    "La mejor forma de predecir el futuro es crearlo.",
    "En MobilityADO, menos es más: simplifica para innovar.",
    "El trabajo en equipo acelera el éxito.",
    "La movilidad conecta personas, ideas y sueños."
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Cambia la frase cada 30 segundos con desvanecimiento
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % motivationalPhrases.length);
        setFade(true);
      }, 800);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Render principal
  return (
    <div style={styles.container}>
      <header style={styles.header}>
          <h1
            style={{
              ...styles.mainTitle,
              position: 'relative',
              fontSize: '2.2rem',
              letterSpacing: '1.2px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              zIndex: 1,
            }}
          >
            <span style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '100%',
              height: '110%',
              zIndex: 0,
              borderRadius: 18,
              background: 'linear-gradient(90deg, #ff9800 0%, #e53935 30%, #a084b6 60%, #00bcd4 100%)',
              filter: 'blur(12px) brightness(1.2)',
              opacity: 0.55,
              animation: 'shinebg 3.5s linear infinite',
            }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: 2, position: 'relative', top: '2px', zIndex: 2 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ff9800"/>
                    <stop offset="0.3" stopColor="#e53935"/>
                    <stop offset="0.6" stopColor="#a084b6"/>
                    <stop offset="1" stopColor="#00bcd4"/>
                  </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="15" stroke="url(#logoGrad)" strokeWidth="2.5" fill="#fff"/>
                <ellipse cx="16" cy="16" rx="10" ry="15" stroke="url(#logoGrad)" strokeWidth="1.5" fill="none"/>
                <ellipse cx="16" cy="16" rx="15" ry="5" stroke="url(#logoGrad)" strokeWidth="1.5" fill="none"/>
                <path d="M6 16h20" stroke="url(#logoGrad)" strokeWidth="1.5"/>
                <path d="M16 2v28" stroke="url(#logoGrad)" strokeWidth="1.5"/>
              </svg>
            </span>
            <span style={{
              position: 'relative',
              zIndex: 2,
              padding: '0 12px',
              color: '#632569',
              textShadow: '0 2px 12px #fff, 0 1px 0 #e0c6f7, 0 0px 18px #a084b6',
              fontWeight: 900,
              letterSpacing: '1.2px',
              fontFamily: 'Montserrat, Inter, sans-serif',
              filter: 'drop-shadow(0 2px 8px #fff6)',
            }}>
              MOBILITY AI
            </span>
            <style>{`
              @keyframes shinebg {
                0% { filter: blur(12px) brightness(1.2); opacity: 0.55; }
                50% { filter: blur(18px) brightness(1.4); opacity: 0.75; }
                100% { filter: blur(12px) brightness(1.2); opacity: 0.55; }
              }
            `}</style>
          </h1>
        <div style={{
          width: '100%',
          margin: '0 auto 12px auto',
          maxWidth: 650,
          minHeight: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span
            key={phraseIndex}
            style={{
              color: '#bdbdbd',
              fontWeight: 500,
              fontSize: 13,
              letterSpacing: 0.1,
              padding: '0 8px',
              opacity: fade ? 1 : 0,
              transition: 'opacity 0.8s',
              textAlign: 'center',
              width: '100%',
              display: 'block',
            }}
          >
            {motivationalPhrases[phraseIndex]}
          </span>
        </div>
        {/* Barra roja divisor */}
        <div style={{ width: '100%', maxWidth: 650, height: 5, margin: '0 auto 18px auto', background: '#e53935', borderRadius: 3, boxShadow: '0 1px 6px 0 #e5393533' }} />
      </header>
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabButton(activeTab === "ai"),
            background: activeTab === "ai"
              ? 'linear-gradient(90deg, #00c6fb 0%, #005bea 100%)'
              : '#1a237e',
            color: 'white',
            fontWeight: 900,
            letterSpacing: 0.5,
            textShadow: '0 1px 8px #fff3',
            border: 'none',
            fontFamily: 'Montserrat, Inter, sans-serif',
            boxShadow: activeTab === "ai" ? '0 2px 12px 0 rgba(0,38,255,0.13)' : styles.tabButton(false).boxShadow,
            transition: 'all 0.18s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          onClick={() => setActiveTab("ai")}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight:4}}>
            <circle cx="10" cy="10" r="9" stroke="#fff" strokeWidth="1.5" fill="#00c6fb"/>
            <ellipse cx="10" cy="10" rx="6" ry="9" stroke="#fff" strokeWidth="1.1" fill="none"/>
            <ellipse cx="10" cy="10" rx="9" ry="3" stroke="#fff" strokeWidth="1.1" fill="none"/>
            <path d="M4 10h12" stroke="#fff" strokeWidth="1.1"/>
            <path d="M10 1v18" stroke="#fff" strokeWidth="1.1"/>
          </svg>
          IA
        </button>
        <button
          style={{
            ...styles.tabButton(activeTab === "docu"),
            background: activeTab === "docu"
              ? 'linear-gradient(90deg, #ff9800 0%, #e53935 40%, #a084b6 80%, #00bcd4 100%)'
              : '#632569',
            color: 'white',
            fontWeight: 900,
            letterSpacing: 0.5,
            textShadow: '0 1px 8px #fff3',
            border: 'none',
            fontFamily: 'Montserrat, Inter, sans-serif',
            boxShadow: activeTab === "docu" ? '0 2px 12px 0 rgba(99,37,105,0.13)' : styles.tabButton(false).boxShadow,
            transition: 'all 0.18s',
          }}
          onClick={() => setActiveTab("docu")}
        >🚀 Potenciador de Ideas</button>
        <button
          style={{
            ...styles.tabButton(activeTab === "dmama"),
            background: activeTab === "dmama"
              ? 'linear-gradient(90deg, #00c6fb 0%, #ff9800 100%)'
              : '#00838f',
            color: 'white',
            fontWeight: 900,
            letterSpacing: 0.5,
            textShadow: '0 1px 8px #fff3',
            border: 'none',
            fontFamily: 'Montserrat, Inter, sans-serif',
            boxShadow: activeTab === "dmama" ? '0 2px 12px 0 rgba(0,131,143,0.13)' : styles.tabButton(false).boxShadow,
            transition: 'all 0.18s',
          }}
          onClick={() => setActiveTab("dmama")}
        >📄 DocuIA</button>
      </div>
      {/* TAB 3: DOCUIA */}
      {activeTab === "dmama" && (
        <div style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 2px 16px 0 rgba(0,131,143,0.08)',
          maxWidth: 600,
          margin: '0 auto',
          padding: '32px 24px 28px 24px',
          marginBottom: 32,
        }}>
          <h2 style={{
            color: '#00838f',
            fontWeight: 900,
            fontSize: 20,
            margin: '0 0 18px 0',
            letterSpacing: 0.5,
            textAlign: 'center',
            fontFamily: 'Montserrat, Inter, sans-serif',
          }}>Guía DMAMA para Documentar tu Idea</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoadingDmama(true);
            setDmamaResult('');
            const prompt = `\nEres Mobility AI, el asistente oficial de Mobility ADO.\nAyuda a un colaborador a estructurar su idea de mejora usando la metodología DMAMA (Definir, Medir, Analizar, Mejorar, Asegurar).\n\nLa información del proyecto es:\n• Colaborador: ${dmamaForm.colaborador}\n• Área: ${dmamaForm.area}\n• Descripción de la mejora: ${dmamaForm.descripcion}\n\nGenera una guía breve, clara y visual con:\n\n1. 🔎 Planteamiento del Problema  \n   — Sugiérele cómo redactar su problema de manera estructurada (contexto, causa y efecto).  \n\n2. 🎯 Objetivo del Proyecto  \n   — Propón una forma simple y clara de escribir un objetivo (qué se quiere lograr y para qué).  \n\n3. 📊 Indicadores de Éxito  \n   — Propón 2 indicadores relevantes para medir el impacto del proyecto.  \n   — Solo indicadores, sin metas ni objetivos.  \n\n4. 🛠️ Herramientas Útiles  \n   — Recomienda 2 o 3 herramientas prácticas que le ayuden a documentar su proyecto (ej. Empathy Map, Diagrama de Ishikawa, Pareto, Customer Journey, prototipos rápidos).  \n\n5. 💡 Tips por Fase DMAMA  \n   — Da tips cortos, prácticos y accionables para cada fase:  \n     ✅ Definir: cómo enfocar bien el problema  \n     ✅ Medir: qué tipo de datos conviene recolectar  \n     ✅ Analizar: cómo detectar causas raíz  \n     ✅ Mejorar: cómo generar y elegir soluciones  \n     ✅ Asegurar: cómo estandarizar y dar seguimiento  \n\nEl resultado debe ser breve, ejecutivo y fácil de usar en una presentación o dashboard, usando frases cortas, bullets y emojis para hacerlo claro y atractivo.\n`;
            const res = await fetch('https://mejora-continua-ia.onrender.com/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages: [
                { role: 'user', content: prompt }
              ] }),
            });
            const data = await res.json();
            setDmamaResult(data.response || 'No se pudo generar la guía.');
            setIsLoadingDmama(false);
          }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Colaborador"
                value={dmamaForm.colaborador}
                onChange={e => setDmamaForm(f => ({ ...f, colaborador: e.target.value }))}
                style={{ flex: 1, minWidth: 120, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #b2ebf2', fontSize: 15, fontFamily: 'Inter, sans-serif' }}
                required
              />
              <input
                type="text"
                placeholder="Área"
                value={dmamaForm.area}
                onChange={e => setDmamaForm(f => ({ ...f, area: e.target.value }))}
                style={{ flex: 1, minWidth: 120, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #b2ebf2', fontSize: 15, fontFamily: 'Inter, sans-serif' }}
                required
              />
            </div>
            <textarea
              placeholder="Describe brevemente la mejora que quieres documentar..."
              value={dmamaForm.descripcion}
              onChange={e => setDmamaForm(f => ({ ...f, descripcion: e.target.value }))}
              style={{ width: '100%', minHeight: 60, borderRadius: 10, border: '1.5px solid #b2ebf2', fontSize: 15, fontFamily: 'Inter, sans-serif', marginBottom: 18, padding: '10px 14px' }}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 0 }}>
              <button
                type="submit"
                disabled={isLoadingDmama}
                style={{
                  background: 'linear-gradient(90deg, #00c6fb 0%, #ff9800 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '0 28px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(0,131,143,0.10)',
                  transition: 'all 0.18s',
                  minHeight: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 0,
                  fontFamily: 'Montserrat, Inter, sans-serif',
                  textShadow: '0 1px 8px #fff3',
                }}
              >
                {isLoadingDmama ? '🔄 Generando...' : '📄 Generar Guía DMAMA'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDmamaForm({ colaborador: '', area: '', descripcion: '' });
                  setDmamaResult('');
                }}
                style={{
                  background: '#e53935',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  minHeight: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(229,57,53,0.10)',
                  transition: 'all 0.18s',
                  marginLeft: 8,
                }}
                title="Limpiar formulario"
                disabled={isLoadingDmama}
              >
                {/* Icono refresh */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 10A5.5 5.5 0 0115 7.5M15.5 10A5.5 5.5 0 015 12.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M13.5 6V8H15.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M6.5 14v-2H4.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </form>
          {dmamaResult && (
            <div style={{
              background: 'linear-gradient(120deg, #e3f0ff 60%, #f8e9ff 100%)',
              border: '2.5px solid #00bcd4',
              borderRadius: 22,
              boxShadow: '0 6px 32px 0 rgba(0,188,212,0.13), 0 1.5px 12px 0 #a084b655',
              marginTop: 32,
              padding: '36px 28px 30px 28px',
              fontSize: 17,
              color: '#2a2950',
              fontFamily: 'Montserrat, Inter, sans-serif',
              lineHeight: 1.8,
              fontWeight: 500,
              position: 'relative',
              overflow: 'hidden',
              minHeight: 120,
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
              transition: 'box-shadow 0.2s',
            }}>
              {/* Icono de bombilla inspiradora */}
              <div style={{position:'absolute',top:18,right:24,opacity:0.13,fontSize:110,lineHeight:1,fontWeight:900,color:'#00bcd4',pointerEvents:'none',zIndex:0}}>💡</div>
              <div style={{position:'absolute',bottom:18,left:24,opacity:0.10,fontSize:80,lineHeight:1,fontWeight:900,color:'#a084b6',pointerEvents:'none',zIndex:0}}>🚀</div>
              <div style={{position:'relative',zIndex:1}}>
                {(() => {
                  // Elimina asteriscos, gatos y emojis
                  let clean = dmamaResult
                    .replace(/[\*#]/g, '')
                    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
                  // Resalta en negritas las líneas que empiezan con número y punto y los nombres de las fases DMAMA
                  return clean.split(/\r?\n/).map((line, idx) => {
                    if (/^\d+\./.test(line.trim())) {
                      return <div key={idx} style={{fontWeight:900, color:'#00bcd4', fontSize:18, margin:'14px 0 6px 0', letterSpacing:0.5}}><strong>{line.trim()}</strong></div>;
                    }
                    // Resalta nombres de fases DMAMA
                    const dmamaPhases = ["Definir", "Medir", "Analizar", "Mejorar", "Asegurar"];
                    let phaseFound = dmamaPhases.find(phase => line.trim().toLowerCase().startsWith(phase.toLowerCase()+':'));
                    if (phaseFound) {
                      const [phase, ...rest] = line.split(':');
                      return <div key={idx}><strong style={{color:'#a084b6'}}>{phase.trim()}:</strong>{rest.join(':')}</div>;
                    }
                    // Resalta el título 'Guía de Mejora con DMAMA para ...'
                    if (/^Guía de Mejora con DMAMA para /i.test(line.trim())) {
                      return <div key={idx} style={{fontWeight:900, color:'#00bcd4', fontSize:20, margin:'18px 0 10px 0', letterSpacing:0.5}}><strong>{line.trim()}</strong></div>;
                    }
                    return <div key={idx}>{line}</div>;
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      )}
      <main>
        {/* TAB 1: MOBILITY AI */}
        {activeTab === "ai" && (
          <div style={{
            background: 'linear-gradient(120deg, #f8f9fa 60%, #e3d6f3 100%)',
            border: '2.5px solid #a084b6',
            borderRadius: 18,
            padding: '28px 24px 22px 24px',
            marginTop: 8,
            boxShadow: '0 4px 32px 0 rgba(99,37,105,0.13)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 320,
            maxWidth: 650,
            marginLeft: 'auto',
            marginRight: 'auto',
            transition: 'box-shadow 0.2s',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <h2 style={{ color: '#632569', fontWeight: 800, fontSize: 22, margin: 0, letterSpacing: '0.5px' }}>¿Necesitas ideas?</h2>
              <div style={{ color: '#a084b6', fontSize: 15, marginTop: 2 }}>¡Cuéntame tu reto o pregunta y te ayudo a innovar!</div>
              <div style={{ width: '100%', height: 1, background: '#ece6f3', margin: '18px 0 10px 0', borderRadius: 2 }} />
            </div>
            <div style={styles.chatContainer}>
              {chat.map((msg, i) => (
                <div
                  key={i}
                  style={msg.sender === "ai" ? styles.bubbleAI : styles.bubbleUser}
                >
                  {msg.sender === "ai"
                    ? renderChatMessage(msg.text)
                    : msg.text}
                </div>
              ))}
              {isLoading && (
                <div style={styles.bubbleAI}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'moveBus 1.2s linear infinite' }}>
                      {/* Cuerpo del autobús rojo */}
                      <rect x="2" y="7" width="36" height="10" rx="3" fill="#e53935" stroke="#b71c1c" strokeWidth="1.5"/>
                      {/* Ventanas */}
                      <rect x="6" y="10" width="7" height="4" rx="1.2" fill="#fff"/>
                      <rect x="14.5" y="10" width="7" height="4" rx="1.2" fill="#fff"/>
                      <rect x="23" y="10" width="7" height="4" rx="1.2" fill="#fff"/>
                      {/* Puerta */}
                      <rect x="32" y="10" width="4" height="6" rx="1.2" fill="#fff"/>
                      {/* Ruedas */}
                      <circle cx="10" cy="19.5" r="2.2" fill="#222" stroke="#b71c1c" strokeWidth="0.7"/>
                      <circle cx="30" cy="19.5" r="2.2" fill="#222" stroke="#b71c1c" strokeWidth="0.7"/>
                      {/* Detalles */}
                      <rect x="37.5" y="13" width="3" height="2.5" rx="0.8" fill="#b71c1c"/>
                      <rect x="2" y="13" width="2.5" height="2.5" rx="0.8" fill="#b71c1c"/>
                    </svg>
                  </span>
                  <style>{`
                    @keyframes moveBus {
                      0% { transform: translateX(0); }
                      50% { transform: translateX(12px); }
                      100% { transform: translateX(0); }
                    }
                  `}</style>
                </div>
              )}
            </div>
            <div style={styles.chatInputRow}>
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
              <button onClick={sendMessage} style={styles.chatButton} disabled={isLoading} title="Enviar">
                {isLoading ? (
                  <span style={{ fontSize: 22 }}>...</span>
                ) : (
                  // Flecha hacia arriba SVG
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="11" fill="#632569" />
                    <path d="M11 6V16" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                    <path d="M7.5 9.5L11 6L14.5 9.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
              <button
                onClick={() => setChat([
                  {
                    sender: "ai",
                    text: `¡Hola! Soy Mobility AI, tu asistente digital en Mobility ADO.\n\nEstoy aquí para apoyarte en tu día a día. ¿Cómo puedo ayudarte hoy?\n\nPuedo ayudarte a:\n• Generar ideas para mejorar procesos, productos o servicios.\n• Buscar soluciones prácticas a los retos que enfrentas.\n• Guiarte para estructurar y potenciar propuestas de mejora.\n• Sugerir KPIs, pasos iniciales y detectar riesgos.\n\nCuéntame tu reto, idea o pregunta y juntos encontraremos la mejor solución.`
                  },
                ])}
                style={{ ...styles.chatButton, background: '#e53935', marginLeft: 8 }}
                disabled={isLoading}
                title="Reiniciar chat"
              >
                {/* Espiral SVG */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="11" fill="#e53935" />
                  <path d="M15.5 11C15.5 8.51472 13.4853 6.5 11 6.5C8.51472 6.5 6.5 8.51472 6.5 11C6.5 13.4853 8.51472 15.5 11 15.5C12.3807 15.5 13.5 14.3807 13.5 13C13.5 11.6193 12.3807 10.5 11 10.5C9.61929 10.5 8.5 11.6193 8.5 13" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: POTENCIADOR DE IDEAS */}
        {activeTab === "docu" && (
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <h2 style={{ color: '#632569', fontWeight: 800, fontSize: 22, margin: 0, letterSpacing: '0.5px' }}>Potenciador de Ideas</h2>
              <div style={{ color: '#a084b6', fontSize: 15, marginTop: 2 }}>Completa el formulario y recibe sugerencias para mejorar tu propuesta.</div>
              <div style={{ width: '100%', height: 1, background: '#ece6f3', margin: '18px 0 10px 0', borderRadius: 2 }} />
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
            <div style={{ display: 'flex', justifyContent: 'center', gap: 0, margin: '18px 0 0 0' }}>
              <button
                onClick={handleDocumentationSubmit}
                style={{
                  background: 'linear-gradient(90deg, #ff9800 0%, #e53935 40%, #a084b6 80%, #00bcd4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px 0 rgba(99,37,105,0.13)',
                  transition: 'all 0.18s',
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 0,
                  fontFamily: 'Montserrat, Inter, sans-serif',
                  textShadow: '0 1px 8px #fff3',
                }}
                disabled={isLoading}
              >
                {isLoading ? '🔄 Potenciando...' : '🚀 Potenciar Idea'}
              </button>
              <button
                onClick={() => {
                  setFormData({ collaborator: '', area: '', problem: '', proposal: '' });
                  setDocumentationResult('');
                }}
                style={{
                  background: '#e53935',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  minHeight: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(229,57,53,0.10)',
                  transition: 'all 0.18s',
                  marginLeft: 14,
                }}
                title="Limpiar formulario"
                disabled={isLoading}
              >
                {/* Icono refresh */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 10A5.5 5.5 0 0115 7.5M15.5 10A5.5 5.5 0 015 12.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M13.5 6V8H15.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/>
                  <path d="M6.5 14v-2H4.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {documentationResult && (
              <div style={{
                background: 'linear-gradient(120deg, #e3f0ff 60%, #f8e9ff 100%)',
                border: '2.5px solid #00bcd4',
                borderRadius: 22,
                boxShadow: '0 6px 32px 0 rgba(0,188,212,0.13), 0 1.5px 12px 0 #a084b655',
                marginTop: 32,
                padding: '36px 28px 30px 28px',
                fontSize: 17,
                color: '#2a2950',
                fontFamily: 'Montserrat, Inter, sans-serif',
                lineHeight: 1.8,
                fontWeight: 500,
                position: 'relative',
                overflow: 'hidden',
                minHeight: 120,
                maxWidth: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
                transition: 'box-shadow 0.2s',
              }}>
                {/* Icono de bombilla inspiradora */}
                <div style={{position:'absolute',top:18,right:24,opacity:0.13,fontSize:110,lineHeight:1,fontWeight:900,color:'#00bcd4',pointerEvents:'none',zIndex:0}}>💡</div>
// ...existing code...
                <div style={{position:'absolute',bottom:18,left:24,opacity:0.10,fontSize:80,lineHeight:1,fontWeight:900,color:'#a084b6',pointerEvents:'none',zIndex:0}}>🚀</div>
                                <div style={{position:'relative',zIndex:1}}>
                                  {renderDocuResult(documentationResult)}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

      </main>
    </div>
  );
}
