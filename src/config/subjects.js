import imgTeoria from '../assets/1.png';
import imgRecuperatorio from '../assets/2.png';
import imgPrimeraVuelta from '../assets/3.png';
import { Sparkles, Skull, BookOpen } from 'lucide-react';

export const SUBJECTS_CONFIG = {
  poo: {
    title: 'Programación Orientada a Objetos',
    csvPath: '/datos-poo.csv',
    themes: {
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
    }
  },
  pi2: {
    title: 'Proyecto Integrador 2',
    csvPath: '/datos-pi2.csv',
    themes: {
      primera_vuelta: {
        id: 'primera_vuelta',
        title: 'Primera Vuelta',
        subtitle: 'Fácil',
        icon: Sparkles,
        bgColor: '#312e81',
        activeTabBg: '#4f46e5',
        buttonBg: '#6366f1',
        cardBg: imgPrimeraVuelta,
        textColor: '#312e81',
        badgeBg: '#4338ca',
        sound: 'easy'
      },
      recuperatorio: {
        id: 'recuperatorio',
        title: 'Recuperatorio',
        subtitle: 'Difícil',
        icon: Skull,
        bgColor: '#701a75',
        activeTabBg: '#c026d3',
        buttonBg: '#d946ef',
        cardBg: imgRecuperatorio,
        textColor: '#701a75',
        badgeBg: '#a21caf',
        sound: 'hard'
      },
      teoria: {
        id: 'teoria',
        title: 'Teoría',
        subtitle: 'Conceptos',
        icon: BookOpen,
        bgColor: '#134e4a',
        activeTabBg: '#0d9488',
        buttonBg: '#14b8a6',
        cardBg: imgTeoria,
        textColor: '#134e4a',
        badgeBg: '#0f766e',
        sound: 'theory'
      }
    }
  }
};