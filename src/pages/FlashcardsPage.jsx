import React, { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, RefreshCw, Shuffle, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { SUBJECTS_CONFIG } from "../config/subjects";
import { playSound } from "../utils/audio";
import { parseCSV } from "../utils/csvParser";

export default function FlashcardsPage() {
  const { subjectId } = useParams();
  const subject = SUBJECTS_CONFIG[subjectId];

  // Si la materia ingresada en la URL no existe, redirigir al Home
  if (!subject) return <Navigate to="/" replace />;

  const [cardsData, setCardsData] = useState([]);
  const [category, setCategory] = useState("primera_vuelta");
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentTheme = subject.themes[category];

  useEffect(() => {
    setLoading(true);
    setCurrentCard(null);

    fetch(subject.csvPath)
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseCSV(text);
        setCardsData(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando el CSV:", err);
        setLoading(false);
      });
  }, [subjectId]);

  const drawCard = () => {
    const filtered = cardsData.filter(
      (c) =>
        c.categoria &&
        c.categoria.toLowerCase().trim() === category.toLowerCase().trim(),
    );

    if (filtered.length === 0) return;

    let nextCard = currentCard;
    if (filtered.length > 1) {
      while (nextCard === currentCard) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        nextCard = filtered[randomIndex];
      }
    } else {
      nextCard = filtered[0];
    }

    playSound("flip", soundEnabled);
    setIsFlipped(true);

    setTimeout(() => {
      setCurrentCard(nextCard);
      setIsFlipped(false);
      if (category === "primera_vuelta") {
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
      }
    }, 200);
  };

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    setCurrentCard(null);
    playSound(subject.themes[catId].sound, soundEnabled);
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#09090b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          Cargando {subject.title}...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: currentTheme.bgColor,
        display: "flex",
        flexDirection: "column",
        justify: "space-between",
        padding: "16px",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        transition: "background-color 0.4s ease",
      }}
    >
      {/* Botón Volver */}
      <Link
        to="/"
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 50,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          textDecoration: "none",
        }}
      >
        <ArrowLeft size={20} />
      </Link>

      {/* Botón Mute */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 50,
          padding: "8px",
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.3)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.2)",
          cursor: "pointer",
        }}
      >
        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>

      {/* HEADER */}
      <header
        style={{
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "900",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              margin: 0,
            }}
          >
            {React.createElement(currentTheme.icon, { size: 22 })}
            {subject.title} - {currentTheme.title}
          </h1>
        </div>

        {/* Categorías */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "6px",
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: "4px",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {Object.values(subject.themes).map((t) => {
            const Icon = t.icon;
            const isActive = category === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleCategoryChange(t.id)}
                style={{
                  padding: "10px 4px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: isActive ? t.activeTabBg : "transparent",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                  fontWeight: isActive ? "bold" : "normal",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                }}
              >
                <Icon size={16} />
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t.title}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* CARTA CENTRAL Y BOTÓN */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justify: "center",
          width: "100%",
          margin: "12px 0",
          gap: "16px",
          position: "relative",
        }}
      >
        <motion.div
          onClick={drawCard}
          whileTap={{ scale: 0.95 }}
          animate={{
            rotateY: isFlipped ? 90 : 0,
            scale: isFlipped ? 0.92 : 1,
          }}
          transition={{ duration: 0.18 }}
          style={{
            position: "relative",
            width: "85vw",
            maxWidth: "320px",
            height: "55vh",
            maxHeight: "440px",
            borderRadius: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justify: "center",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          }}
        >
          <img
            src={currentTheme.cardBg}
            alt={currentTheme.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "fill",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justify: "space-between",
              padding: "32px 24px",
              boxSizing: "border-box",
            }}
          >
            <AnimatePresence mode="wait">
              {currentCard ? (
                <motion.div
                  key={currentCard.id || currentCard.numero}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "900",
                        padding: "3px 10px",
                        borderRadius: "12px",
                        backgroundColor: currentTheme.badgeBg,
                        color: "#fff",
                      }}
                    >
                      #{currentCard.numero}
                    </span>
                    <Shuffle size={16} style={{ color: "rgba(0,0,0,0.3)" }} />
                  </div>

                  <div style={{ margin: "auto 0" }}>
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "16px",
                        fontWeight: "800",
                        lineHeight: "1.4",
                        color: currentTheme.textColor,
                        margin: 0,
                      }}
                    >
                      {currentCard.enunciado}
                    </p>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                        color: "rgba(0,0,0,0.4)",
                        textTransform: "uppercase",
                      }}
                    >
                      Toca para cambiar
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Shuffle
                    size={28}
                    style={{ color: "rgba(0,0,0,0.4)", marginBottom: "8px" }}
                  />
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: currentTheme.textColor,
                      margin: 0,
                    }}
                  >
                    Toca la carta
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={drawCard}
          style={{
            display: "flex",
            alignItems: "center",
            justify: "center",
            gap: "8px",
            backgroundColor: currentTheme.buttonBg,
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <RefreshCw size={16} />
          {currentCard ? "Cambiar carta" : "Sacar carta"}
        </motion.button>
      </main>

      <footer style={{ width: "100%", textAlign: "center", zIndex: 10 }}>
        <p
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.5)",
            margin: 0,
          }}
        >
          {currentTheme.subtitle}
        </p>
      </footer>
    </div>
  );
}
