import { useState, useEffect } from "react";
import jsPDF from 'jspdf';


// Componente de estrellas animadas para el fondo del espacio exterior
function StarField() {
  const [stars, setStars] = useState([]);
  const [brightStars, setBrightStars] = useState([]);

  useEffect(() => {
    // Generar estrellas aleatorias
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 150; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: Math.random() * 3,
          twinkleSpeed: Math.random() * 2 + 1
        });
      }
      setStars(newStars);

      // Generar estrellas brillantes especiales
      const newBrightStars = [];
      for (let i = 0; i < 8; i++) {
        newBrightStars.push({
          id: `bright-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 3,
          opacity: Math.random() * 0.6 + 0.4,
          animationDelay: Math.random() * 4,
          twinkleSpeed: Math.random() * 3 + 2,
          color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'][i % 8]
        });
      }
      setBrightStars(newBrightStars);
    };

    generateStars();
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 0
    }}>
      {/* Efecto de nebulosa sutil */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '200px',
        height: '150px',
        background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '150px',
        height: '120px',
        background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 40%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite 2s',
      }} />
      
      {/* Estrellas normales */}
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            opacity: star.opacity,
            animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite ${star.animationDelay}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
          }}
        />
      ))}
      
      {/* Estrellas brillantes especiales */}
      {brightStars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            borderRadius: '50%',
            opacity: star.opacity,
            animation: `brightTwinkle ${star.twinkleSpeed}s ease-in-out infinite ${star.animationDelay}s`,
            boxShadow: `0 0 ${star.size * 3}px ${star.color}, 0 0 ${star.size * 6}px rgba(255, 255, 255, 0.3)`
          }}
        />
      ))}
      
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes brightTwinkle {
          0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.1; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}

// Función específica para renderizar resultados de DocuIA (DMAMA)
function renderDmamaResult(text) {
  if (!text) return null;
  
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const blocks = [];
  let currentList = [];

  // Patrones para identificar títulos en DocuIA
  const titlePatterns = [
    /^\d+\.\s+[A-ZÁÉÍÓÚÑ]/i, // 1. PLANTEAMIENTO, 2. OBJETIVO, etc.
    /^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s]+:$/i, // Títulos en mayúsculas con dos puntos
    /^(?:PLANTEAMIENTO|OBJETIVO|INDICADORES|HERRAMIENTAS|TIPS|DEFINIR|MEDIR|ANALIZAR|MEJORAR|ASEGURAR)/i
  ];

  lines.forEach((line, idx) => {
    const isTitle = titlePatterns.some(pattern => pattern.test(line));
    const isBullet = /^[-•*➢›]/.test(line);
    
    if (isTitle) {
      // Renderizar lista pendiente si existe
      if (currentList.length > 0) {
        blocks.push(<ul key={`list-${idx}`} style={{ margin: '8px 0 12px 20px', padding: 0 }}>{currentList}</ul>);
        currentList = [];
      }
      
      // Renderizar título
      blocks.push(
        <div key={`title-${idx}`} style={{
          fontWeight: 900,
          color: '#00838f',
          fontSize: '18px',
          margin: '20px 0 8px 0',
          padding: '8px 12px',
          background: 'rgba(0, 131, 143, 0.1)',
          borderRadius: '8px',
          borderLeft: '4px solid #00838f'
        }}>
          {line}
        </div>
      );
    } 
    else if (isBullet) {
      // Líneas con viñetas
      const bulletContent = line.replace(/^[-•*➢›]\s*/, '');
      currentList.push(
        <li key={`item-${currentList.length}`} style={{
          marginBottom: '6px',
          lineHeight: '1.5',
          fontSize: '16px',
          padding: '2px 0'
        }}>
          {bulletContent}
        </li>
      );
    }
    else if (line) {
      // Renderizar lista pendiente si existe
      if (currentList.length > 0) {
        blocks.push(<ul key={`list-${idx}`} style={{ margin: '8px 0 12px 20px', padding: 0 }}>{currentList}</ul>);
        currentList = [];
      }
      
      // Texto normal
      blocks.push(
        <div key={`text-${idx}`} style={{
          marginBottom: '8px',
          lineHeight: '1.6',
          fontSize: '16px',
          padding: '4px 0'
        }}>
          {line}
        </div>
      );
    }
  });

  // Renderizar cualquier lista pendiente al final
  if (currentList.length > 0) {
    blocks.push(<ul key="list-final" style={{ margin: '8px 0 12px 20px', padding: 0 }}>{currentList}</ul>);
  }

  return blocks;
}

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

Cuéntame tu reto, idea o pregunta y juntos encontraremos la mejor solución.`,
      suggestions: [
        "¿Cómo puedo mejorar la experiencia del cliente?",
        "Necesito ideas para optimizar procesos",
        "Ayúdame a estructurar un proyecto de mejora",
        "¿Qué KPIs debería medir para mi área?"
      ]
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

  // Estilos profesionales modernos
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: 0,
      margin: 0,
      width: '100vw',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      maxWidth: '100%',
    },
    header: {
      padding: 'clamp(20px, 6vw, 32px) 0 clamp(12px, 4vw, 16px) 0',
      textAlign: 'center',
      marginBottom: '12px',
      background: 'linear-gradient(180deg, #0a0a23 0%, #0f0f2a 15%, #1a1a3a 30%, #252545 45%, #303050 60%, #404060 75%, #606080 90%, rgba(255, 255, 255, 0.99) 100%)',
      borderBottom: '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 'clamp(150px, 25vh, 200px)',
    },
    mainTitle: {
      color: '#1a202c',
      margin: 0,
      fontSize: 'clamp(24px, 6vw, 40px)',
      fontWeight: '600',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    tabs: {
      display: 'flex',
      justifyContent: 'center',
      gap: 'clamp(4px, 2vw, 8px)',
      marginTop: '-8px',
      marginBottom: 'clamp(20px, 6vw, 32px)',
      padding: '0 clamp(12px, 4vw, 16px)',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      width: '100%',
      boxSizing: 'border-box',
      WebkitOverflowScrolling: 'touch',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
    },
    tabButton: (active) => ({
      padding: 'clamp(10px, 3vw, 12px) clamp(16px, 4vw, 20px)',
      border: 'none',
      background: active ? 'linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)' : '#f8fafc',
      color: active ? 'white' : '#4a5568',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: 'clamp(13px, 3.5vw, 14px)',
      transition: 'all 0.2s ease',
      outline: 'none',
      boxShadow: active ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
      minWidth: 'clamp(80px, 20vw, 100px)',
      touchAction: 'manipulation',
    }),
    bubbleAI: {
      alignSelf: 'flex-start',
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)',
      color: 'white',
      borderRadius: '12px',
      padding: '14px 18px',
      maxWidth: '85%',
      boxSizing: 'border-box',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
      fontSize: '15px',
      marginBottom: 12,
      fontWeight: 400,
      position: 'relative',
      zIndex: 1,
      wordBreak: 'break-word',
      backdropFilter: 'blur(10px)',
    },
    bubbleUser: {
      alignSelf: 'flex-end',
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      color: 'white',
      borderRadius: '12px',
      padding: '14px 18px',
      maxWidth: '85%',
      boxSizing: 'border-box',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
      fontSize: '15px',
      marginBottom: 12,
      fontWeight: 400,
      position: 'relative',
      zIndex: 1,
      wordBreak: 'break-word',
    },
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'clamp(8px, 2vw, 12px)',
      padding: 'clamp(16px, 4vw, 20px)',
      minHeight: 'clamp(250px, 50vh, 300px)',
      height: 'clamp(300px, 60vh, 60vh)',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      touchAction: 'pan-y',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '100%',
      overscrollBehavior: 'contain',
    },
    chatInputRow: {
      display: 'flex',
      gap: 'clamp(6px, 2vw, 8px)',
      marginTop: 0,
      marginLeft: 'clamp(4px, 1vw, 4px)',
      marginRight: 'clamp(4px, 1vw, 4px)',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      boxSizing: 'border-box',
    },
    chatInput: {
      flex: 1,
      padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: 'clamp(14px, 3.5vw, 15px)',
      outline: 'none',
      background: '#ffffff',
      boxShadow: 'none',
      minWidth: 0,
      width: '100%',
      maxWidth: '100%',
      transition: 'all 0.2s ease',
      touchAction: 'manipulation',
    },
    chatButton: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      width: 'clamp(44px, 12vw, 48px)',
      height: 'clamp(44px, 12vw, 48px)',
      minWidth: 'clamp(44px, 12vw, 48px)',
      minHeight: 'clamp(44px, 12vw, 48px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'clamp(16px, 4vw, 18px)',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
      transition: 'all 0.2s ease',
      touchAction: 'manipulation',
    },
    input: {
      width: '100%',
      padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: 'clamp(12px, 3vw, 16px)',
      fontSize: 'clamp(14px, 3.5vw, 15px)',
      outline: 'none',
      fontFamily: 'inherit',
      background: '#ffffff',
      transition: 'all 0.2s ease',
      boxShadow: 'none',
      boxSizing: 'border-box',
      touchAction: 'manipulation',
    },
    textarea: {
      width: '100%',
      padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: 'clamp(12px, 3vw, 16px)',
      fontSize: 'clamp(14px, 3.5vw, 15px)',
      minHeight: 'clamp(80px, 20vh, 100px)',
      resize: 'vertical',
      outline: 'none',
      fontFamily: 'inherit',
      background: '#ffffff',
      transition: 'all 0.2s ease',
      boxShadow: 'none',
      boxSizing: 'border-box',
      touchAction: 'manipulation',
    },
    button: {
      background: 'linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)',
      color: 'white',
      border: 'none',
      padding: 'clamp(12px, 3vw, 14px) clamp(24px, 6vw, 28px)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: 'clamp(14px, 3.5vw, 15px)',
      fontWeight: '500',
      margin: 'clamp(6px, 2vw, 8px)',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
      boxSizing: 'border-box',
      touchAction: 'manipulation',
    },
    resultCard: {
      background: '#ffffff',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: '100%',
    },
    card: {
      background: 'none',
      boxShadow: 'none',
      border: 'none',
      padding: 0,
      margin: '0 auto',
      maxWidth: 'min(98vw, 600px)',
      marginTop: 'clamp(6px, 2vw, 8px)',
      marginLeft: 'clamp(6px, 2vw, 8px)',
      marginRight: 'clamp(6px, 2vw, 8px)',
      width: '100%',
      boxSizing: 'border-box',
      marginBottom: 'clamp(18px, 8vw, 38px)',
    },
    suggestionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'clamp(6px, 2vw, 8px)',
      marginTop: 'clamp(8px, 2vw, 12px)',
      padding: '0 clamp(2px, 1vw, 4px)',
    },
    suggestionChip: {
      background: '#ffffff',
      border: '1px solid #8B5CF6',
      borderRadius: '16px',
      padding: 'clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)',
      fontSize: 'clamp(12px, 3vw, 13px)',
      color: '#8B5CF6',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 4px rgba(139, 92, 246, 0.1)',
      fontWeight: 500,
      touchAction: 'manipulation',
    },
  };

  // Función para manejar sugerencias
  const handleSuggestion = async (suggestion) => {
    setMessage(suggestion);
    setIsLoading(true);
    
    try {
      const res = await fetch('https://mejora-continua-ia.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            { role: 'user', content: suggestion }
          ] 
        }),
      });
      const data = await res.json();
      
      setChat(prev => [...prev, 
        { sender: "user", text: suggestion },
        { 
          sender: "ai", 
          text: data.response || 'No se pudo procesar tu solicitud.',
          suggestions: getSuggestionsForResponse(data.response || '')
        }
      ]);
    } catch (error) {
      setChat(prev => [...prev, 
        { sender: "user", text: suggestion },
        { 
          sender: "ai", 
          text: '❌ Error al procesar tu solicitud. Por favor, intenta nuevamente.',
          suggestions: [
            "¿Puedes reformular tu pregunta?",
            "Intenta con una consulta más específica",
            "¿Necesitas ayuda con algo específico?"
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  // Función para generar sugerencias contextuales
  const getSuggestionsForResponse = (response) => {
    const lowerResponse = response.toLowerCase();
    
    // Solo mostrar sugerencias si la respuesta es larga o contiene información específica
    if (lowerResponse.length < 100) {
      return null; // No mostrar sugerencias para respuestas cortas
    }
    
    // Solo mostrar sugerencias si la respuesta contiene información útil
    const hasUsefulInfo = lowerResponse.includes('kpi') || 
                         lowerResponse.includes('indicador') ||
                         lowerResponse.includes('proceso') ||
                         lowerResponse.includes('optimizar') ||
                         lowerResponse.includes('herramienta') ||
                         lowerResponse.includes('software') ||
                         lowerResponse.includes('riesgo') ||
                         lowerResponse.includes('implementar') ||
                         lowerResponse.includes('aplicar') ||
                         lowerResponse.includes('equipo') ||
                         lowerResponse.includes('colaboración');
    
    if (!hasUsefulInfo) {
      return null; // No mostrar sugerencias si no hay información útil
    }
    
    // Sugerencias específicas solo cuando sea apropiado
    if (lowerResponse.includes('kpi') || lowerResponse.includes('indicador')) {
      return [
        "¿Cómo implementar estos KPIs?",
        "¿Qué herramientas usar para medir?"
      ];
    }
    
    if (lowerResponse.includes('proceso') || lowerResponse.includes('optimizar')) {
      return [
        "¿Cuáles son los pasos siguientes?",
        "¿Qué herramientas usar?"
      ];
    }
    
    if (lowerResponse.includes('herramienta') || lowerResponse.includes('software')) {
      return [
        "¿Cómo implementar esta herramienta?",
        "¿Qué capacitación necesito?"
      ];
    }
    
    if (lowerResponse.includes('riesgo') || lowerResponse.includes('problema')) {
      return [
        "¿Cómo mitigar estos riesgos?",
        "¿Qué plan de contingencia crear?"
      ];
    }
    
    if (lowerResponse.includes('implementar') || lowerResponse.includes('aplicar')) {
      return [
        "¿Cuál es el cronograma sugerido?",
        "¿Qué recursos necesito?"
      ];
    }
    
    if (lowerResponse.includes('equipo') || lowerResponse.includes('colaboración')) {
      return [
        "¿Cómo motivar al equipo?",
        "¿Qué roles asignar?"
      ];
    }
    
    // Solo 2 sugerencias por defecto si hay información útil
    return [
      "¿Puedes darme más detalles?",
      "¿Qué pasos debería seguir?"
    ];
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

  // Formateo visual inspirador para el resultado del Potenciador de Ideas
  function renderDocuResult(text) {
    if (!text) return null;
    
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const blocks = [];
    let currentList = [];
    
    // Mapeo de títulos con iconos inspiradores
    const titleIcons = {
      'RESUMEN DEL VALOR DE LA IDEA': '💎',
      'SUGERENCIAS DE MEJORA': '🚀',
      'RIESGOS O DESAFÍOS A CONSIDERAR': '⚠️',
      'PASOS INICIALES RECOMENDADOS': '🎯',
      'KPI CLARO Y MEDIBLE PARA EVALUAR RESULTADOS': '📊'
    };
    
    // Títulos reconocidos
    const titleRegex = /^(RESUMEN DEL VALOR DE LA IDEA|SUGERENCIAS DE MEJORA|RIESGOS O DESAFÍOS A CONSIDERAR|PASOS INICIALES RECOMENDADOS|✅ KPI CLARO Y MEDIBLE PARA EVALUAR RESULTADOS|HERRAMIENTAS ÚTILES)$/i;
    
    const cleanSymbols = (str) => str.replace(/^[#*\-\s]+/, '').trim();
    
    lines.forEach((line, index) => {
      const cleanLine = cleanSymbols(line);
      
      if (titleRegex.test(cleanLine)) {
        // Renderizar lista pendiente si existe
        if (currentList.length > 0) {
          blocks.push(
            <div key={`list-${index}`} style={{
              margin: 'clamp(12px, 3vw, 16px) 0 clamp(16px, 4vw, 20px) 0',
              padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderRadius: 'clamp(10px, 2.5vw, 12px)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              {currentList}
            </div>
          );
          currentList = [];
        }
        
        // Renderizar título inspirador
        const icon = titleIcons[cleanLine.toUpperCase()] || '✨';
        blocks.push(
          <div key={`title-${index}`} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px, 2vw, 12px)',
            margin: 'clamp(16px, 4vw, 24px) 0 clamp(8px, 2vw, 12px) 0',
            padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
            color: 'white',
            fontWeight: 700,
            fontSize: 'clamp(16px, 4vw, 18px)',
            letterSpacing: '0.5px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: 'clamp(20px, 5vw, 24px)' }}>{icon}</span>
            <span style={{ fontWeight: 'bold' }}>{cleanLine.toUpperCase()}</span>
          </div>
        );
      } else if (/^[-•]/.test(line)) {
        // Elementos de lista con diseño inspirador
        const cleanItem = cleanSymbols(line);
        currentList.push(
          <div key={`item-${currentList.length}`} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'clamp(8px, 2vw, 12px)',
            marginBottom: 'clamp(8px, 2vw, 12px)',
            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 'clamp(8px, 2vw, 10px)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
          }}>
            <span style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              color: '#667eea',
              fontWeight: 'bold',
              marginTop: '2px'
            }}>•</span>
            <span style={{
              fontSize: 'clamp(13px, 3.5vw, 15px)',
              lineHeight: '1.5',
              color: '#2d3748',
              fontWeight: 500
            }}>{cleanItem}</span>
          </div>
        );
      } else if (cleanLine) {
        // Renderizar lista pendiente si existe
        if (currentList.length > 0) {
          blocks.push(
            <div key={`list-${index}`} style={{
              margin: '16px 0 20px 0',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              {currentList}
            </div>
          );
          currentList = [];
        }
        
        // Texto normal con diseño mejorado
        blocks.push(
          <div key={`text-${index}`} style={{
            marginBottom: 'clamp(8px, 2vw, 12px)',
            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 'clamp(8px, 2vw, 10px)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            fontSize: 'clamp(13px, 3.5vw, 15px)',
            lineHeight: '1.5',
            color: '#4a5568',
            fontWeight: 400
          }}>
            {cleanLine}
          </div>
        );
      }
    });
    
    // Renderizar cualquier lista pendiente al final
    if (currentList.length > 0) {
      blocks.push(
        <div key="list-final" style={{
          margin: 'clamp(12px, 3vw, 16px) 0 clamp(16px, 4vw, 20px) 0',
          padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          borderRadius: 'clamp(10px, 2.5vw, 12px)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          {currentList}
        </div>
      );
    }
    
    return blocks;
  }

  // Función para generar PDF del resultado de DocuIA
  const generateDmamaPDF = () => {
    if (!dmamaResult) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    // Configuración de fuentes
    doc.setFont('helvetica');
    
    // Título principal
    doc.setFontSize(20);
    doc.setTextColor(99, 37, 105); // Color Mobility ADO
    doc.text('Guía DMAMA - Mobility ADO', pageWidth / 2, 30, { align: 'center' });
    
    // Información del proyecto
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Colaborador: ${dmamaForm.colaborador}`, margin, 50);
    doc.text(`Área: ${dmamaForm.area}`, margin, 60);
    doc.text(`Descripción: ${dmamaForm.descripcion}`, margin, 70);
    
    // Línea divisoria
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, 85, pageWidth - margin, 85);
    
    // Contenido del resultado
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    let yPosition = 100;
    
    const lines = dmamaResult.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    
    lines.forEach((line, index) => {
      // Detectar títulos
      const isTitle = /^(PLANTEAMIENTO|OBJETIVO|INDICADORES|HERRAMIENTAS|TIPS|DEFINIR|MEDIR|ANALIZAR|MEJORAR|ASEGURAR)/i.test(line);
      
      if (isTitle) {
        // Verificar si necesitamos nueva página
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFontSize(16);
        doc.setTextColor(0, 131, 143); // Color azul Mobility ADO
        doc.setFont('helvetica', 'bold');
        doc.text(line.toUpperCase(), margin, yPosition);
        yPosition += 15;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
      } else if (line.startsWith('-') || line.startsWith('•')) {
        // Elementos de lista
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 30;
        }
        
        const bulletText = line.replace(/^[-•]\s*/, '');
        const wrappedText = doc.splitTextToSize(`• ${bulletText}`, maxWidth - 10);
        
        doc.setFontSize(11);
        doc.text(wrappedText, margin + 5, yPosition);
        yPosition += (wrappedText.length * 5) + 3;
      } else if (line.trim()) {
        // Texto normal
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 30;
        }
        
        const wrappedText = doc.splitTextToSize(line, maxWidth);
        doc.setFontSize(11);
        doc.text(wrappedText, margin, yPosition);
        yPosition += (wrappedText.length * 5) + 5;
      }
    });
    
    // Pie de página
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Mobility ADO - Página ${i} de ${totalPages}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    // Generar nombre del archivo
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `DocuIA_${dmamaForm.colaborador}_${timestamp}.pdf`;
    
    // Descargar PDF
    doc.save(fileName);
  };

  // Función específica para renderizar resultados de DocuIA (DMAMA) - Versión inspiradora
  function renderDmamaResult(text) {
    if (!text) return null;
  
    // Función para parsear negritas de markdown
    const parseMarkdown = (text) => {
      if (!text) return text;
    
      // Convertir **texto** a <strong>texto</strong>
      const parts = [];
      const regex = /\*\*(.*?)\*\*/g;
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
        parts.push(text.slice(lastIndex));
      }
    
      return parts.length > 0 ? parts : text;
    };

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(line => {
      // Filtrar líneas vacías, solo guiones, o líneas que solo contienen caracteres especiales
      return line && 
             !/^[-_*]+$/.test(line) && 
             !/^[^\w\s]+$/.test(line) &&
             line.length > 0;
    });
    const blocks = [];
    let currentList = [];

    // Mapeo de títulos con iconos inspiradores para DocuIA
    const titleIcons = {
      'planteamiento': '🔎',
      'objetivo': '🎯',
      'indicadores': '📊',
      'herramientas': '🛠️',
      'tips': '💡',
      'definir': '📝',
      'medir': '📏',
      'analizar': '🔍',
      'mejorar': '⚡',
      'asegurar': '🛡️'
    };

    // Patrones específicos para los títulos de DocuIA
    const titlePatterns = [
      /^#+\s*planteamiento del problema/i,
      /^#+\s*objetivo del proyecto/i,
      /^#+\s*indicadores de éxito/i,
      /^#+\s*herramientas útiles/i,
      /^#+\s*tips por fase/i,
      /^planteamiento del problema/i,
      /^objetivo del proyecto/i,
      /^indicadores de éxito/i,
      /^herramientas útiles/i,
      /^tips por fase/i,
      /^#+\s*[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+:/i, // Títulos con ## y dos puntos
      /^#+\s*[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+\s*$/i, // Títulos con ## solos
      /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+:/i, // Títulos con dos puntos
      /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+\s*$/i, // Títulos solos
      /^(planteamiento|objetivo|indicadores|herramientas|tips|definir|medir|analizar|mejorar|asegurar)/i
    ];

    lines.forEach((line, idx) => {
      if (!line.trim()) return;
      
      // Ignorar líneas que solo contienen guiones o caracteres especiales
      if (/^[-_*]+$/.test(line.trim()) || /^[^\w\s]+$/.test(line.trim())) return;

      // Limpiar la línea: quitar ## y espacios extra
      let cleanLine = line
        .replace(/^#+\s*/, '') // Quitar ## y cualquier número de #
        .trim();
      
      // Función específica para detectar títulos de DocuIA
      const isDocuIATitle = (text) => {
        const lowerText = text.toLowerCase().trim();
        // Detectar títulos específicos de DocuIA
        return lowerText.includes('planteamiento del problema') ||
               lowerText.includes('objetivo del proyecto') ||
               lowerText.includes('indicadores de éxito') ||
               lowerText.includes('herramientas útiles') ||
               lowerText.includes('tips por fase') ||
               (lowerText.includes('planteamiento') && lowerText.length < 50) ||
               (lowerText.includes('objetivo') && lowerText.length < 50) ||
               (lowerText.includes('indicadores') && lowerText.length < 50) ||
               (lowerText.includes('herramientas') && lowerText.length < 50) ||
               (lowerText.includes('tips') && lowerText.length < 50);
      };
      
      // Verificar si es título - lógica simplificada
      const isTitle = isDocuIATitle(line) || isDocuIATitle(cleanLine);
      
      // Debug temporal para ver qué está pasando
      if (line.includes('#') && (line.includes('planteamiento') || line.includes('objetivo') || line.includes('indicadores') || line.includes('herramientas') || line.includes('tips'))) {
        console.log('DEBUG - Línea con #:', line);
        console.log('DEBUG - CleanLine:', cleanLine);
        console.log('DEBUG - IsTitle:', isTitle);
        console.log('DEBUG - IsDocuIATitle(line):', isDocuIATitle(line));
        console.log('DEBUG - IsDocuIATitle(cleanLine):', isDocuIATitle(cleanLine));
      }
      const isBullet = /^[-•]/.test(line);
    
      if (isTitle) {
        // Renderizar lista pendiente si existe
        if (currentList.length > 0) {
          blocks.push(
            <div key={`list-${idx}`} style={{
              margin: 'clamp(12px, 3vw, 16px) 0 clamp(16px, 4vw, 20px) 0',
              padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
              background: 'linear-gradient(135deg, rgba(0, 131, 143, 0.05) 0%, rgba(0, 188, 212, 0.05) 100%)',
              borderRadius: 'clamp(10px, 2.5vw, 12px)',
              border: '1px solid rgba(0, 131, 143, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              {currentList}
            </div>
          );
          currentList = [];
        }
      
        // Renderizar título inspirador
        blocks.push(
          <div key={`title-${idx}`} style={{
            margin: 'clamp(16px, 4vw, 24px) 0 clamp(8px, 2vw, 12px) 0',
            padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
            background: 'linear-gradient(135deg, #00838f 0%, #00bcd4 100%)',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            boxShadow: '0 4px 20px rgba(0, 131, 143, 0.2)',
            color: 'white',
            fontWeight: 700,
            fontSize: 'clamp(16px, 4vw, 18px)',
            letterSpacing: '0.5px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontWeight: 'bold' }}>{cleanLine.toUpperCase()}</span>
          </div>
        );
      } 
      else if (isBullet) {
        // Elementos de lista con diseño inspirador
        const bulletContent = line.replace(/^[-•]\s*/, '');
        currentList.push(
          <div key={`item-${currentList.length}`} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'clamp(8px, 2vw, 12px)',
            marginBottom: 'clamp(8px, 2vw, 12px)',
            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 'clamp(8px, 2vw, 10px)',
            border: '1px solid rgba(0, 131, 143, 0.1)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 16px rgba(0, 131, 143, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
          }}>
            <span style={{
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              color: '#00838f',
              fontWeight: 'bold',
              marginTop: '2px'
            }}>•</span>
            <span style={{
              fontSize: 'clamp(13px, 3.5vw, 15px)',
              lineHeight: '1.5',
              color: '#2d3748',
              fontWeight: 500
            }}>{parseMarkdown(bulletContent)}</span>
          </div>
        );
      }
      else if (line) {
        // Renderizar lista pendiente si existe
        if (currentList.length > 0) {
          blocks.push(
            <div key={`list-${idx}`} style={{
              margin: 'clamp(12px, 3vw, 16px) 0 clamp(16px, 4vw, 20px) 0',
              padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
              background: 'linear-gradient(135deg, rgba(0, 131, 143, 0.05) 0%, rgba(0, 188, 212, 0.05) 100%)',
              borderRadius: 'clamp(10px, 2.5vw, 12px)',
              border: '1px solid rgba(0, 131, 143, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              {currentList}
            </div>
          );
          currentList = [];
        }
      
        // Texto normal con diseño mejorado
        blocks.push(
          <div key={`text-${idx}`} style={{
            marginBottom: 'clamp(8px, 2vw, 12px)',
            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 'clamp(8px, 2vw, 10px)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            fontSize: 'clamp(13px, 3.5vw, 15px)',
            lineHeight: '1.5',
            color: '#4a5568',
            fontWeight: 400
          }}>
            {parseMarkdown(line)}
          </div>
        );
      }
    });

    // Renderizar cualquier lista pendiente al final
    if (currentList.length > 0) {
      blocks.push(
        <div key="list-final" style={{
          margin: 'clamp(12px, 3vw, 16px) 0 clamp(16px, 4vw, 20px) 0',
          padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 20px)',
          background: 'linear-gradient(135deg, rgba(0, 131, 143, 0.05) 0%, rgba(0, 188, 212, 0.05) 100%)',
          borderRadius: 'clamp(10px, 2.5vw, 12px)',
          border: '1px solid rgba(0, 131, 143, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          {currentList}
        </div>
      );
    }

    return blocks;
  }

  // Prompts - CONTEXTO MEJORADO Y MÁS ESTRICTO
  const companyContext = `Eres Mobility AI, el asistente digital de Mobility ADO. Eres amable, servicial y conoces profundamente la empresa.

# CONTEXTO DE MOBILITY ADO:
• **Misión**: "Mejoramos la calidad de vida a través de la movilidad"
• **Somos líderes** en movilidad y transporte en México y Latinoamérica
• **Principios clave**: seguridad, eficiencia, experiencia, innovación, sostenibilidad
• **Enfoque**: hacer que los viajes sean fáciles y accesibles para todos

# QUEREMOS:
• Promover educación sobre movilidad
• Compartir información para acelerar el éxito comercial  
• Buscar el avance humano construyendo comunidades
• Que menos sea más (simplicidad)
• Ser parte del futuro del transporte

# TU ESTILO:
• Responde de forma natural y conversacional
• Usa emojis moderadamente 😊
• Sé útil en cualquier tema, pero cuando sea relevante menciona nuestro contexto
• Si preguntan sobre Mobility ADO, comparte información precisa
• Para temas de mejora continua e innovación, ofrece ideas específicas

# NO NECESITAS:
• Restringir temas de conversación
• Ser demasiado formal
• Repetir constantemente que eres de Mobility ADO

Simplemente sé un asistente útil que conoce y ama su empresa.`;

  const docuContext = `Eres MOBILITY AI, asistente experto en innovación de Mobility ADO (líder en movilidad y transporte en México y Latinoamérica).
Principios clave: seguridad, eficiencia, experiencia del cliente, innovación, mejora continua, sostenibilidad y cultura colaborativa.

RESPONDE SIEMPRE EN ESPAÑOL con este formato estricto:

RESUMEN DEL VALOR DE LA IDEA
- (Breve descripción del valor)

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

NO uses asteriscos, ni gatos, ni símbolos especiales para títulos o negritas.
Los títulos deben ir al inicio de cada sección, en mayúsculas, y claramente diferenciados. 
Usa viñetas simples para listas.`;

  // Handlers principales - CORREGIDOS
  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsLoading(true);
    const userMessage = { sender: "user", text: message };
    setChat(prev => [...prev, userMessage]);
    setMessage("");
    try {
      const promptWithContext = `${companyContext}\n\nUsuario: ${message}`;
      // Usar la ruta correcta para el chat general
      const response = await fetch('https://mejora-continua-ia.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "user", content: promptWithContext }
          ]
        }),
      });
      if (!response.ok) throw new Error('Error de conexión');
      const data = await response.json();
      setChat(prev => [...prev, { 
        sender: "ai", 
        text: data.response,
        suggestions: getSuggestionsForResponse(data.response) // Solo mostrará sugerencias cuando sea apropiado
      }]);
    } catch (error) {
      setChat(prev => [...prev, { 
        sender: "ai", 
        text: "❌ Error de conexión. Por favor, intenta nuevamente." 
      }]);
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

Responde estrictamente con el formato solicitado.
`;
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: "user", content: prompt }
          ]
        }),
      });
      if (!response.ok) throw new Error('Error de conexión');
      const data = await response.json();
      setDocumentationResult(data.response);
      
      // Guardar datos automáticamente
      try {
        await fetch('https://mejora-continua-ia.onrender.com/api/save-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'potenciador',
            data: {
              ...formData,
              result: data.response
            }
          }),
        });
      } catch (saveError) {
        console.log("Error al guardar datos:", saveError);
      }
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
      <style>{`
        /* Estilos móviles adicionales */
        @media (max-width: 768px) {
          * {
            -webkit-tap-highlight-color: transparent;
          }
          
          input, textarea, button {
            font-size: 16px !important; /* Previene zoom en iOS */
          }
          
          .mobile-optimized {
            touch-action: manipulation;
            -webkit-user-select: none;
            user-select: none;
          }
          
          .mobile-optimized:active {
            -webkit-user-select: auto;
            user-select: auto;
          }
        }
        
        /* Prevenir scroll horizontal */
        body {
          overflow-x: hidden;
          width: 100%;
        }
        
        /* Mejorar scroll en móviles */
        .chat-scroll-fix {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
      `}</style>
      <header style={styles.header}>
        <StarField />
        <h1
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            gap: 12,
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: '600',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            position: 'relative',
            zIndex: 2,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          }}
        >
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            marginRight: 12,
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}>
            {/* Icono de autobús inspirado en Mobility ADO */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Cuerpo del autobús */}
              <rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="2" fill="none"/>
              {/* Ventanas */}
              <rect x="5" y="8" width="3" height="3" fill="white" opacity="0.8"/>
              <rect x="10" y="8" width="3" height="3" fill="white" opacity="0.8"/>
              <rect x="15" y="8" width="3" height="3" fill="white" opacity="0.8"/>
              {/* Ruedas */}
              <circle cx="7" cy="18" r="2" stroke="white" strokeWidth="2" fill="none"/>
              <circle cx="17" cy="18" r="2" stroke="white" strokeWidth="2" fill="none"/>
              {/* Línea de dirección */}
              <path d="M3 10h18" stroke="white" strokeWidth="1" opacity="0.6"/>
            </svg>
          </span>
          <span style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            position: 'relative',
          }}>
            MOBILITY AI
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-20px',
              fontSize: '12px',
              opacity: 0.7,
            }}>
              🚌
            </span>
          </span>
        </h1>
        <div style={{
          width: '100%',
          margin: '0 auto 16px auto',
          maxWidth: 500,
          minHeight: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}>
          <span
            key={phraseIndex}
            style={{
              color: '#e2e8f0',
              fontWeight: 400,
              fontSize: '13px',
              letterSpacing: '0.025em',
              padding: '0 8px',
              opacity: fade ? 1 : 0,
              transition: 'opacity 0.8s',
              textAlign: 'center',
              width: '100%',
              display: 'block',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            {motivationalPhrases[phraseIndex]}
          </span>
        </div>
        {/* Barra divisoria con colores Mobility ADO */}
        <div style={{ 
          width: '100%', 
          maxWidth: 400, 
          height: 2, 
          margin: '0 auto 20px auto', 
          background: 'linear-gradient(90deg, #8B5CF6 0%, #EF4444 100%)', 
          borderRadius: 1,
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)',
        }} />
      {/* Texto informativo con marco */}
      <div style={{
        width: '100%',
        maxWidth: 500,
        margin: '0 auto 8px auto',
        textAlign: 'center',
        fontSize: '14px',
        color: '#cbd5e0',
        fontWeight: 400,
        letterSpacing: '0.025em',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        zIndex: 2,
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
        padding: '8px 16px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        Transforma ideas en innovación con IA 🚌
      </div>
      </header>
      
      {/* Carretera 2D divisoria */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(16px, 4vw, 20px)',
        margin: '0 auto clamp(16px, 4vw, 20px) auto',
        background: 'linear-gradient(90deg, #2d3748 0%, #4a5568 20%, #718096 40%, #a0aec0 50%, #718096 60%, #4a5568 80%, #2d3748 100%)',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}>
        {/* Líneas de la carretera */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
          height: '2px',
          background: 'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 20px, transparent 20px, transparent 40px)',
          transform: 'translateY(-50%)',
          animation: 'moveRoad 2s linear infinite',
        }} />
        
        {/* Líneas laterales */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, transparent 15%, #e2e8f0 15%, #e2e8f0 16%, transparent 16%, transparent 84%, #e2e8f0 84%, #e2e8f0 85%, transparent 85%, transparent 100%)',
        }} />
        
        {/* Efecto de profundidad */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          height: '100%',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
        }} />
        
                 {/* Autobús pequeño decorativo */}
         <div style={{
           position: 'absolute',
           top: '50%',
           left: '20%',
           transform: 'translateY(-50%)',
           width: 'clamp(20px, 5vw, 25px)',
           height: 'clamp(10px, 2.5vw, 12px)',
           background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
           borderRadius: '4px 4px 1px 1px',
           boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
           animation: 'moveBus 4s ease-in-out infinite',
         }}>
          {/* Ventanas del autobús */}
          <div style={{
            position: 'absolute',
            top: '1px',
            left: '2px',
            width: '4px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '1px',
          }} />
          <div style={{
            position: 'absolute',
            top: '1px',
            left: '8px',
            width: '4px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '1px',
          }} />
          <div style={{
            position: 'absolute',
            top: '1px',
            left: '14px',
            width: '4px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '1px',
          }} />
          {/* Ruedas */}
          <div style={{
            position: 'absolute',
            bottom: '-1px',
            left: '3px',
            width: '3px',
            height: '3px',
            background: '#2d3748',
            borderRadius: '50%',
            border: '1px solid #4a5568',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-1px',
            right: '3px',
            width: '3px',
            height: '3px',
            background: '#2d3748',
            borderRadius: '50%',
            border: '1px solid #4a5568',
          }} />
        </div>
        
        <style>{`
          @keyframes moveRoad {
            0% { transform: translateY(-50%) translateX(0px); }
            100% { transform: translateY(-50%) translateX(-40px); }
          }
          @keyframes moveBus {
            0%, 100% { transform: translateY(-50%) translateX(0px); }
            50% { transform: translateY(-50%) translateX(15px); }
          }
        `}</style>
      </div>
      
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabButton(activeTab === "ai"),
            display: 'flex',
            alignItems: 'center',
            gap: 8,
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
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          onClick={() => setActiveTab("docu")}
        >
          🚀 Potenciador
        </button>
        <button
          style={{
            ...styles.tabButton(activeTab === "dmama"),
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          onClick={() => setActiveTab("dmama")}
        >
          📄 DocuIA
        </button>
      </div>
      {/* TAB 3: DOCUIA */}
      {activeTab === "dmama" && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          maxWidth: 600,
          margin: '0 auto',
          padding: '32px',
          marginBottom: 32,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
        }}>
          <h2 style={{
            color: '#632569',
            fontWeight: 700,
            fontSize: '24px',
            margin: '0 0 16px 0',
            letterSpacing: '-0.025em',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }}>📄 Guía DMAMA para Documentar tu Idea</h2>
          <div style={{
            textAlign: 'center',
            marginBottom: '24px',
            color: '#a084b6',
            fontSize: '15px',
            lineHeight: '1.6',
            fontFamily: 'Inter, sans-serif',
          }}>
            Estructura tu innovación con metodología probada.
            <br />
            <span style={{ fontSize: '13px', opacity: 0.8, color: '#a084b6' }}>
              Define, Mide, Analiza, Mejora y Asegura el éxito de tu proyecto 🎯
            </span>
          </div>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsLoadingDmama(true);
            setDmamaResult('');
            const prompt = `Eres Mobility AI, el asistente oficial de Mobility ADO.
Ayuda a un colaborador a estructurar su idea de mejora usando la metodología DMAMA (Definir, Medir, Analizar, Mejorar, Asegurar).

La información del proyecto es:
• Colaborador: ${dmamaForm.colaborador}
• Área: ${dmamaForm.area}
• Descripción de la mejora: ${dmamaForm.descripcion}

Genera una guía breve, clara y visual con:

1. 🔎 Planteamiento del Problema  
   — Sugiérele cómo redactar su problema de manera estructurada (contexto, causa y efecto).  

2. 🎯 Objetivo del Proyecto  
   — Propón una forma simple y clara de escribir un objetivo (qué se quiere lograr y para qué).  

3. 📊 Indicadores de Éxito  
   — Propón 2 indicadores relevantes para medir el impacto del proyecto.  
   — Solo indicadores, sin metas ni objetivos.  

4. 🛠️ Herramientas Útiles  
   — Recomienda 2 o 3 herramientas prácticas que le ayuden a documentar su proyecto (ej. Empathy Map, Diagrama de Ishikawa, Pareto, Customer Journey, prototipos rápidos).  

5. 💡 Tips por Fase DMAMA  
   — Da tips cortos, prácticos y accionables para cada fase:  
     ✅ Definir: cómo enfocar bien el problema  
     ✅ Medir: qué tipo de datos conviene recolectar  
     ✅ Analizar: cómo detectar causas raíz  
     ✅ Mejorar: cómo generar y elegir soluciones  
     ✅ Asegurar: cómo estandarizar y dar seguimiento  

El resultado debe ser breve, ejecutivo y fácil de usar en una presentación o dashboard, usando frases cortas, bullets y emojis para hacerlo claro y atractivo.`;
            try {
                              const res = await fetch('https://mejora-continua-ia.onrender.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [
                  { role: 'user', content: prompt }
                ] }),
              });
              const data = await res.json();
              setDmamaResult(data.response || 'No se pudo generar la guía.');
              
              // Guardar datos automáticamente
              try {
                await fetch('https://mejora-continua-ia.onrender.com/api/save-data', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'docuia',
                    data: {
                      ...dmamaForm,
                      result: data.response || 'No se pudo generar la guía.'
                    }
                  }),
                });
              } catch (saveError) {
                console.log("Error al guardar datos:", saveError);
              }
            } catch (error) {
              setDmamaResult('❌ Error al generar la guía. Por favor, intenta nuevamente.');
            } finally {
              setIsLoadingDmama(false);
            }
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
              <select
                value={dmamaForm.area}
                onChange={e => setDmamaForm(f => ({ ...f, area: e.target.value }))}
                style={{ flex: 1, minWidth: 120, padding: '10px 14px', borderRadius: 10, border: '1.5px solid #b2ebf2', fontSize: 15, fontFamily: 'Inter, sans-serif', background: '#ffffff', cursor: 'pointer' }}
                required
              >
                <option value="">Selecciona un área</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Comercial">Comercial</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Contraloría">Contraloría</option>
                <option value="Turismo">Turismo</option>
                <option value="TEPER">TEPER</option>
                <option value="EMCO">EMCO</option>
              </select>
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
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f4fd 100%)',
              border: '2px solid #00838f',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 131, 143, 0.12)',
              marginTop: '28px',
              padding: '28px 24px',
              fontSize: '16px',
              color: '#2a2950',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.6',
            }}>
              {/* Botón de descarga PDF */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '20px',
                gap: '12px'
              }}>
                <button
                  onClick={generateDmamaPDF}
                  style={{
                    background: 'linear-gradient(135deg, #00838f 0%, #00bcd4 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(0, 131, 143, 0.3)',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(0, 131, 143, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 131, 143, 0.3)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4V12L16.5 9.5C16.9 9.1 17.5 9.1 17.9 9.5C18.3 9.9 18.3 10.5 17.9 10.9L12.7 16.1C12.3 16.5 11.7 16.5 11.3 16.1L6.1 10.9C5.7 10.5 5.7 9.9 6.1 9.5C6.5 9.1 7.1 9.1 7.5 9.5L10 12V4C10 2.9 10.9 2 12 2Z" fill="white"/>
                    <path d="M20 20H4C3.4 20 3 20.4 3 21C3 21.6 3.4 22 4 22H20C20.6 22 21 21.6 21 21C21 20.4 20.6 20 20 20Z" fill="white"/>
                  </svg>
                  Descargar PDF
                </button>
              </div>
              
              <div style={{position:'relative',zIndex:1}}>
                {renderDmamaResult(dmamaResult)}
              </div>
            </div>
          )}
        </div>
      )}
  <main style={{width:'100%', boxSizing:'border-box'}}>
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
            <div style={{
              ...styles.chatContainer,
              padding: 0,
              overflow: 'visible',
            }}>
              <div
                className="chat-scroll-fix"
                style={{
                  width: '100%',
                  height: '60vh',
                  overflowY: 'auto',
                  padding: 'min(8vw, 32px) min(3vw, 18px) min(5vw, 22px) min(3vw, 18px)',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  alignItems: 'flex-start',
                  // REMUEVE justify-content: flex-end
                }}
                tabIndex={0}
              >
                {/* Forzar scroll en móviles y barra visible en desktop */}
                <style>{`
                  .chat-scroll-fix {
                    -webkit-overflow-scrolling: touch !important;
                    overflow-y: auto !important;
                    overscroll-behavior: auto !important;
                    scroll-behavior: smooth;
                    -webkit-tap-highlight-color: transparent;
                    -webkit-user-select: none;
                    user-select: none;
                  }
                  .chat-scroll-fix:active {
                    -webkit-user-select: auto;
                    user-select: auto;
                  }
                  .chat-scroll-fix::-webkit-scrollbar {
                    width: 8px;
                    background: #ece6f3;
                    border-radius: 8px;
                  }
                  .chat-scroll-fix::-webkit-scrollbar-thumb {
                    background: #bdbdbd;
                    border-radius: 8px;
                  }
                `}</style>
                {chat.map((msg, i) => (
                  <div key={i} style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === "ai" ? 'flex-start' : 'flex-end'
                  }}>
                    <div
                      style={msg.sender === "ai" ? styles.bubbleAI : styles.bubbleUser}
                    >
                      {msg.sender === "ai"
                        ? renderChatMessage(msg.text)
                        : msg.text}
                    </div>
                    {msg.sender === "ai" && msg.suggestions && msg.suggestions.length > 0 && (
                      <div style={styles.suggestionsContainer}>
                        {msg.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestion(suggestion)}
                            style={styles.suggestionChip}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                              e.target.style.transform = 'translateY(-1px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                            }}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div style={styles.bubbleAI}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'moveBus 1.2s linear infinite' }}>
                        <rect x="2" y="7" width="36" height="10" rx="3" fill="#e53935" stroke="#b71c1c" strokeWidth="1.5"/>
                        <rect x="6" y="10" width="7" height="4" rx="1.2" fill="#fff"/>
                        <rect x="14.5" y="10" width="7" height="4" rx="1.2" fill="#fff"/>
                        <rect x="23" y="10" width="7" height="4" rx="1.2" fill="#fff"/>
                        <rect x="32" y="10" width="4" height="6" rx="1.2" fill="#fff"/>
                        <circle cx="10" cy="19.5" r="2.2" fill="#222" stroke="#b71c1c" strokeWidth="0.7"/>
                        <circle cx="30" cy="19.5" r="2.2" fill="#222" stroke="#b71c1c" strokeWidth="0.7"/>
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
              <style>{`
                .chat-scroll-fix::-webkit-scrollbar {
                  width: 8px;
                  background: #ece6f3;
                  border-radius: 8px;
                }
                .chat-scroll-fix::-webkit-scrollbar-thumb {
                  background: #bdbdbd;
                  border-radius: 8px;
                }
              `}</style>
            </div>
            <div style={{ ...styles.chatInputRow, marginTop: 18 }}>
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
                    text: `¡Hola! Soy Mobility AI, tu asistente digital en Mobility ADO.\n\nEstoy aquí para apoyarte en tu día a día. ¿Cómo puedo ayudarte hoy?\n\nPuedo ayudarte a:\n• Generar ideas para mejorar procesos, productos o servicios.\n• Buscar soluciones prácticas a los retos que enfrentas.\n• Guiarte para estructurar y potenciar propuestas de mejora.\n• Sugerir KPIs, pasos iniciales y detectar riesgos.\n\nCuéntame tu reto, idea o pregunta y juntos encontraremos la mejor solución.`,
                    suggestions: [
                      "¿Cómo puedo mejorar la experiencia del cliente?",
                      "Necesito ideas para optimizar procesos",
                      "Ayúdame a estructurar un proyecto de mejora",
                      "¿Qué KPIs debería medir para mi área?"
                    ]
                  },
                ])}
                style={{ ...styles.chatButton, background: '#e53935', marginLeft: 8 }}
                disabled={isLoading}
                title="Reiniciar chat"
              >
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
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 'clamp(16px, 4vw, 20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              maxWidth: 'min(600px, 95vw)',
              margin: '0 auto',
              padding: 'clamp(20px, 6vw, 32px)',
              marginBottom: 'clamp(20px, 6vw, 32px)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <h2 style={{ color: '#632569', fontWeight: 800, fontSize: 22, margin: 0, letterSpacing: '0.5px' }}>🚀 Potenciador de Ideas</h2>
                <div style={{ color: '#a084b6', fontSize: 15, marginTop: 8, lineHeight: '1.6' }}>
                  Transforma tu visión en realidad con IA avanzada. 
                  <br />
                  <span style={{ fontSize: '13px', opacity: 0.8 }}>
                    Cada idea es una semilla de innovación. ¡Hagamos que florezca! ✨
                  </span>
                </div>
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
              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  background: '#ffffff',
                  cursor: 'pointer',
                  padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)',
                }}
                disabled={isLoading}
              >
                <option value="">Selecciona un área</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Comercial">Comercial</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Contraloría">Contraloría</option>
                <option value="Turismo">Turismo</option>
                <option value="TEPER">TEPER</option>
                <option value="EMCO">EMCO</option>
              </select>
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
                  <div style={{position:'absolute',top:18,right:24,opacity:0.13,fontSize:110,lineHeight:1,fontWeight:900,color:'#00bcd4',pointerEvents:'none',zIndex:0}}>💡</div>
                  <div style={{position:'absolute',bottom:18,left:24,opacity:0.10,fontSize:80,lineHeight:1,fontWeight:900,color:'#a084b6',pointerEvents:'none',zIndex:0}}>🚀</div>
                  <div style={{position:'relative',zIndex:1}}>
                    {renderDocuResult(documentationResult)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}