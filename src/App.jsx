import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Skull, BookOpen, Shuffle, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

import imgTeoria from './assets/1.png';
import imgRecuperatorio from './assets/2.png';
import imgPrimeraVuelta from './assets/3.png';

const playSound = (type, soundEnabled = true) => {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'flip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'easy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'hard') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'theory') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.error(e);
  }
};

const parseCSV = (text) => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
    const obj = {};
    headers.forEach((header, i) => {
      let val = values[i] ? values[i].trim() : '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      obj[header] = val;
    });
    return obj;
  });
};

export default function App() {
  const [cardsData, setCardsData] = useState([]);
  const [category, setCategory] = useState('primera_vuelta');
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const themes = {
    primera_vuelta: {
      id: 'primera_vuelta',
      title: 'Primera Vuelta',
      subtitle: 'Fácil',
      icon: Sparkles,
      bgColor: '#064e3b',
      activeTabBg: '#059669',
      cardBg: imgPrimeraVuelta,
      textColor: '#064e3b',
      badgeBg: '#047857',
      sound: 'easy'
    },
    recuperatorio: {
      id: 'recuperatorio',
      title: 'Recuperatorio',
      subtitle: 'Difícil',
      icon: Skull,
      bgColor: '#450a0a',
      activeTabBg: '#dc2626',
      cardBg: imgRecuperatorio,
      textColor: '#7f1d1d',
      badgeBg: '#991b1b',
      sound: 'hard'
    },
    teoria: {
      id: 'teoria',
      title: 'Teoría',
      subtitle: 'Conceptos',
      icon: BookOpen,
      bgColor: '#0f172a',
      activeTabBg: '#2563eb',
      cardBg: imgTeoria,
      textColor: '#1e3a8a',
      badgeBg: '#1d4ed8',
      sound: 'theory'
    }
  };

  const currentTheme = themes[category];

  useEffect(() => {
    fetch('/datos.csv')
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseCSV(text);
        setCardsData(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando CSV:', err);
        setLoading(false);
      });
  }, []);

  const drawCard = () => {
    const filtered = cardsData.filter((c) => c.categoria === category);
    if (filtered.length === 0) return;

    playSound('flip', soundEnabled);
    setIsFlipped(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      setCurrentCard(filtered[randomIndex]);
      setIsFlipped(false);

      if (category === 'primera_vuelta') {
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
      }
    }, 200);
  };

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    setCurrentCard(null);
    playSound(themes[catId].sound, soundEnabled);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', width: '100vw', backgroundColor: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', overflow: 'hidden' }}>
      
      {/* Marco simulador de celular */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        height: '100%',
        maxHeight: '800px',
        backgroundColor: currentTheme.bgColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'background-color 0.4s ease'
      }}>
        
        {/* Botón Mute */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 50,
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer'
          }}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* HEADER */}
        <header style={{ width: '100%', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: 0 }}>
              {React.createElement(currentTheme.icon, { size: 20 })}
              {currentTheme.title}
            </h1>
          </div>

          {/* Navegador por Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '6px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {Object.values(themes).map((t) => {
              const Icon = t.icon;
              const isActive = category === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleCategoryChange(t.id)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? t.activeTabBg : 'transparent',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                    fontWeight: isActive ? 'bold' : 'normal',
                    fontSize: '11px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={14} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{t.title}</span>
                </button>
              );
            })}
          </div>
        </header>

        {/* CONTENEDOR DE LA CARTA (AQUÍ ESTÁ EL FIX DE TAMAÑO) */}
        <main style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxHeight: '480px',
          margin: '12px 0',
          position: 'relative'
        }}>
          <motion.div
            onClick={drawCard}
            whileTap={{ scale: 0.95 }}
            animate={{
              rotateY: isFlipped ? 90 : 0,
              scale: isFlipped ? 0.92 : 1
            }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '280px',
              height: '100%',
              maxHeight: '420px',
              aspectRatio: '3 / 4.2',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            {/* Imagen delimitada por CSS directo */}
            <img
              src={currentTheme.cardBg}
              alt={currentTheme.title}
              className="card-image-fix"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none'
              }}
            />

            {/* Contenido en el centro de la carta */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '28px 24px',
              boxSizing: 'border-box'
            }}>
              <AnimatePresence mode="wait">
                {currentCard ? (
                  <motion.div
                    key={currentCard.id || currentCard.numero}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '900',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: currentTheme.badgeBg,
                        color: '#fff'
                      }}>
                        #{currentCard.numero}
                      </span>
                      <Shuffle size={14} style={{ color: 'rgba(0,0,0,0.3)' }} />
                    </div>

                    <div style={{ margin: 'auto 0', padding: '0 4px' }}>
                      <p style={{
                        textAlign: 'center',
                        fontSize: '15px',
                        fontWeight: '800',
                        lineHeight: '1.3',
                        color: currentTheme.textColor,
                        margin: 0
                      }}>
                        {currentCard.enunciado}
                      </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '8px', fontWeight: 'bold', letterSpacing: '1px', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase' }}>
                        Toca para cambiar
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                  >
                    <Shuffle size={24} style={{ color: 'rgba(0,0,0,0.4)', marginBottom: '8px' }} />
                    <h3 style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', color: currentTheme.textColor, margin: 0 }}>
                      Toca la carta
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>

        <footer style={{ width: '100%', textAlign: 'center', zIndex: 10 }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Toca en cualquier parte de la carta para sacar otra
          </p>
        </footer>
      </div>
    </div>
  );
}