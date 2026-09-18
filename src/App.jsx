import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import FlashcardsPage from './pages/FlashcardsPage';

function Home() {
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