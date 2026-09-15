import React, { useState, useEffect } from 'react';

// Generador sintético de sonidos con Web Audio API
const playSound = (type) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'flip') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'select') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'fire') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.3);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }
};

// Parser liviano de CSV integrado
const parseCSV = (text) => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index];
      return acc;
    }, {});
  });
};

export default function App() {
  const [cardsData, setCardsData] = useState([]);
  const [category, setCategory] = useState('primera_vuelta');
  const [currentCard, setCurrentCard] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar datos del CSV
  useEffect(() => {
    fetch('/datos.csv')
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseCSV(text);
        setCardsData(parsed);
        setLoading(false);
      })
      .catch((err) => console.error('Error al cargar el CSV:', err));
  }, []);

  // Configuración de branding por categoría
  const branding = {
    primera_vuelta: {
      title: 'Primera Vuelta',
      bgClass: 'bg-amber-50 text-emerald-950',
      headerBg: 'bg-emerald-700 text-amber-100 border-amber-300',
      btnActive: 'bg-emerald-600 text-amber-100 shadow-emerald-400/50 shadow-lg scale-105',
      btnInactive: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
      cardBorder: 'border-amber-400/60 shadow-amber-200',
      cardBgImg: '/3.png',
      textColor: 'text-emerald-950',
      badgeBg: 'bg-emerald-800 text-amber-200',
      sound: 'select'
    },
    recuperatorio: {
      title: 'Carta de Recuperatorio',
      bgClass: 'bg-black text-red-500',
      headerBg: 'bg-red-950 text-red-500 border-red-600',
      btnActive: 'bg-red-700 text-black font-bold shadow-red-600/60 shadow-lg scale-105 border border-red-500',
      btnInactive: 'bg-neutral-900 text-red-700 hover:bg-neutral-800',
      cardBorder: 'border-red-600/80 shadow-red-900/50',
      cardBgImg: '/2.png',
      textColor: 'text-red-100',
      badgeBg: 'bg-red-950 text-red-400 border border-red-600',
      sound: 'fire'
    },
    teoria: {
      title: 'Teoría',
      bgClass: 'bg-slate-100 text-blue-950',
      headerBg: 'bg-blue-900 text-cyan-200 border-blue-400',
      btnActive: 'bg-blue-700 text-cyan-200 shadow-blue-400/40 shadow-lg scale-105',
      btnInactive: 'bg-slate-200 text-blue-800 hover:bg-slate-300',
      cardBorder: 'border-blue-400/60 shadow-blue-200',
      cardBgImg: '/1.png',
      textColor: 'text-blue-950',
      badgeBg: 'bg-blue-950 text-cyan-300',
      sound: 'select'
    }
  };

  const currentTheme = branding[category];

  // Selección de carta aleatoria
  const drawRandomCard = () => {
    const filtered = cardsData.filter((item) => item.categoria === category);
    if (filtered.length === 0) return;

    setIsFlipping(true);
    playSound('flip');

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      setCurrentCard(filtered[randomIndex]);
      setIsFlipping(false);
    }, 200);
  };

  const changeCategory = (cat) => {
    setCategory(cat);
    setCurrentCard(null);
    playSound(branding[cat].sound);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p className="animate-pulse text-xl">Cargando cartas desde CSV...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 transition-colors duration-500 font-sans select-none ${currentTheme.bgClass}`}>
      
      {/* Header con Selector de Categorías */}
      <header className="w-full max-w-md mx-auto mb-4">
        <h1 className={`text-center text-xl font-black uppercase tracking-wider py-2 px-4 rounded-xl border-2 mb-4 shadow-md ${currentTheme.headerBg}`}>
          {currentTheme.title}
        </h1>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => changeCategory('primera_vuelta')}
            className={`py-2 px-1 text-xs font-bold rounded-lg transition-all ${
              category === 'primera_vuelta' ? branding.primera_vuelta.btnActive : branding.primera_vuelta.btnInactive
            }`}
          >
            Fácil
          </button>
          <button
            onClick={() => changeCategory('recuperatorio')}
            className={`py-2 px-1 text-xs font-bold rounded-lg transition-all ${
              category === 'recuperatorio' ? branding.recuperatorio.btnActive : branding.recuperatorio.btnInactive
            }`}
          >
            Recuperatorio
          </button>
          <button
            onClick={() => changeCategory('teoria')}
            className={`py-2 px-1 text-xs font-bold rounded-lg transition-all ${
              category === 'teoria' ? branding.teoria.btnActive : branding.teoria.btnInactive
            }`}
          >
            Teoría
          </button>
        </div>
      </header>

      {/* ÁREA CENTRAL / CARTA TAPABLE */}
      <main className="flex-1 flex items-center justify-center my-auto cursor-pointer" onClick={drawRandomCard}>
        <div
          className={`relative w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 transition-transform duration-300 ${
            currentTheme.cardBorder
          } ${isFlipping ? 'scale-95 rotate-2 opacity-80' : 'scale-100 opacity-100 hover:scale-105'}`}
        >
          {/* Imagen de fondo de la carta */}
          <img
            src={currentTheme.cardBgImg}
            alt={currentTheme.title}
            className="absolute inset-0 w-full h-full object-fill pointer-events-none"
          />

          {/* Contenido superpuesto */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8 text-center bg-black/5">
            {currentCard ? (
              <>
                {/* Número superior */}
                <div className="flex justify-end">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full shadow ${currentTheme.badgeBg}`}>
                    #{currentCard.numero}
                  </span>
                </div>

                {/* Enunciado */}
                <div className="my-auto px-2">
                  <p className={`text-lg md:text-xl font-bold leading-relaxed drop-shadow-md ${currentTheme.textColor}`}>
                    {currentCard.enunciado}
                  </p>
                </div>

                <p className="text-[10px] opacity-60 tracking-widest uppercase">Toca para otra carta</p>
              </>
            ) : (
              <div className="my-auto flex flex-col items-center justify-center gap-3">
                <span className="text-4xl animate-bounce">🃏</span>
                <p className={`text-base font-extrabold uppercase tracking-wider ${currentTheme.textColor}`}>
                  Toca la pantalla para obtener una carta
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer / Info */}
      <footer className="text-center text-xs opacity-70 py-2">
        <p>Categoría activa: <span className="font-bold">{currentTheme.title}</span></p>
      </footer>
    </div>
  );
}