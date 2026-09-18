import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Skull, BookOpen, Shuffle, Volume2, VolumeX, RefreshCw } from 'lucide-react';
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
      buttonBg: '#10b981',
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
      buttonBg: '#ef4444',
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
      buttonBg: '#3b82f6',
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
    // Normalizamos el string para evitar fallas por espacios o mayúsculas en el CSV
    const filtered = cardsData.filter(
      (c) => c.categoria && c.categoria.toLowerCase().trim() === category.toLowerCase().trim()
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

    playSound('flip', soundEnabled);
    setIsFlipped(true);

    setTimeout(() => {
      setCurrentCard(nextCard);
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
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'center',
      gap: '24px',
      backgroundColor: '#09090b',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>
        Flashcards de Estudio 📚
      </h1>
      <p style={{ color: '#a1a1aa', margin: 0, fontSize: '14px' }}>
        Selecciona una materia para comenzar a practicar:
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link 
          to="/poo" 
          style={{ 
            padding: '20px 32px', 
            backgroundColor: '#2563eb', 
            color: '#fff', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            transition: 'transform 0.2s'
          }}
        >
          Programación Orientada a Objetos
        </Link>

        <Link 
          to="/pi2" 
          style={{ 
            padding: '20px 32px', 
            backgroundColor: '#0d9488', 
            color: '#fff', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)',
            transition: 'transform 0.2s'
          }}
        >
          Proyecto Informatico II
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:subjectId" element={<FlashcardsPage />} />
    </Routes>
  );
}