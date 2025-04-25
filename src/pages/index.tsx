import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface Guest {
  name: string;
  value: number;
}

const Home: React.FC = () => {
  const [marcosGuests, setMarcosGuests] = useState<Guest[]>([]);
  const [millenaGuests, setMillenaGuests] = useState<Guest[]>([]);
  const [marcosName, setMarcosName] = useState('');
  const [millenaName, setMillenaName] = useState('');
  const [marcosValue, setMarcosValue] = useState(100);
  const [millenaValue, setMillenaValue] = useState(100);
  const [verse] = useState('O amor é paciente, é bondoso, não é invejoso, não é presunçoso, nem orgulhoso. - 1 Coríntios 13:4');

  // Fetch guests from the server on page load
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch('/api/guests');
        const data = await response.json();
        setMarcosGuests(data.marcos || []);
        setMillenaGuests(data.millena || []);
      } catch (error) {
        console.error('Failed to fetch guests:', error);
      }
    };

    fetchGuests();
  }, []);

  const addMarcosGuest = async () => {
    if (marcosName.trim()) {
      const newGuest = { name: marcosName, value: marcosValue };
      setMarcosGuests([...marcosGuests, newGuest]);
      setMarcosName('');
      await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: 'Marcos', guest: newGuest }),
      });
    }
  };

  const addMillenaGuest = async () => {
    if (millenaName.trim()) {
      const newGuest = { name: millenaName, value: millenaValue };
      setMillenaGuests([...millenaGuests, newGuest]);
      setMillenaName('');
      await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: 'Millena', guest: newGuest }),
      });
    }
  };

  const removeMarcosGuest = async (index: number) => {
    const updatedGuests = marcosGuests.filter((_, i) => i !== index);
    setMarcosGuests(updatedGuests);
    await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner: 'Marcos', guests: updatedGuests }),
    });
  };

  const removeMillenaGuest = async (index: number) => {
    const updatedGuests = millenaGuests.filter((_, i) => i !== index);
    setMillenaGuests(updatedGuests);
    await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner: 'Millena', guests: updatedGuests }),
    });
  };

  const marcosTotal = marcosGuests.reduce((sum, guest) => sum + (guest?.value || 0), 0);
  const millenaTotal = millenaGuests.reduce((sum, guest) => sum + (guest?.value || 0), 0);
  const total = marcosTotal + millenaTotal;

  return (
    <div className="container">
      <Head>
        <title>Marcos &amp; Millena - Nosso Grande Dia</title> {/* Escape '&' */}
      </Head>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Marcos & Millena</h1>
          <h2 className="header-subtitle">A união de duas almas</h2>
          <p className="header-verse">
            &quot;E, assim, já não são mais dois, mas uma só carne.&quot; - Mateus 19:6 {/* Escape '"' */}
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        <div className="guest-lists">
          {/* Marcos Guests */}
          <div className="guest-list">
            <h3 className="guest-list-title">Convidados de Marcos</h3>
            <div className="guest-input">
              <input
                type="text"
                value={marcosName}
                onChange={(e) => setMarcosName(e.target.value)}
                placeholder="Nome do convidado"
                className="input-text"
              />
              <input
                type="number"
                value={marcosValue}
                onChange={(e) => setMarcosValue(Number(e.target.value))}
                placeholder="Valor"
                className="input-number"
              />
              <button onClick={addMarcosGuest} className="add-button">
                <svg className="heart-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.5 3 2-5.5L2 7h5.5L10 2l2.5 5H18l-4.5 5.5 2 5.5z" />
                </svg>
                Adicionar
              </button>
            </div>
            <ul className="guest-items">
              {marcosGuests
                .filter((guest) => guest && guest.name) // Ensure guest is valid
                .map((guest, index) => (
                  <li key={index} className="guest-item fade-in">
                    <span>{guest.name}</span>
                    <span>R$ {guest.value.toFixed(2)}</span>
                    <button
                      className="remove-button"
                      onClick={() => removeMarcosGuest(index)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
            </ul>
            <p className="guest-total">Total: R$ {marcosTotal.toFixed(2)}</p>
          </div>

          {/* Millena Guests */}
          <div className="guest-list">
            <h3 className="guest-list-title millena">Convidados de Millena</h3>
            <div className="guest-input">
              <input
                type="text"
                value={millenaName}
                onChange={(e) => setMillenaName(e.target.value)}
                placeholder="Nome do convidado"
                className="input-text"
              />
              <input
                type="number"
                value={millenaValue}
                onChange={(e) => setMillenaValue(Number(e.target.value))}
                placeholder="Valor"
                className="input-number"
              />
              <button onClick={addMillenaGuest} className="add-button millena">
                <svg className="heart-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.5 3 2-5.5L2 7h5.5L10 2l2.5 5H18l-4.5 5.5 2 5.5z" />
                </svg>
                Adicionar
              </button>
            </div>
            <ul className="guest-items">
              {millenaGuests
                .filter((guest) => guest && guest.name) // Ensure guest is valid
                .map((guest, index) => (
                  <li key={index} className="guest-item fade-in millena">
                    <span>{guest.name}</span>
                    <span>R$ {guest.value.toFixed(2)}</span>
                    <button
                      className="remove-button millena"
                      onClick={() => removeMillenaGuest(index)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
            </ul>
            <p className="guest-total millena">Total: R$ {millenaTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Total and Verse */}
        <div className="total-section">
          <h3 className="total-title">A união de nossas vidas, em números de amor!</h3>
          <p className="total-amount">Total Geral: R$ {total.toFixed(2)}</p>
          <div className="verse-section">
            <h4 className="verse-title">Nosso Versículo</h4>
            <p className="verse-text">{verse}</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          Agradecemos pela presença e pelas orações em nosso grande dia, que o Senhor continue abençoando nossas vidas.
        </p>
        <p className="footer-verse">
          &quot;E agora, esses três permanecem: a fé, a esperança e o amor. Mas o maior destes é o amor.&quot; - 1 Coríntios 13:13 {/* Escape '"' */}
        </p>
        <div className="footer-links">
          <a href="#" className="footer-link">Instagram</a>
          <a href="#" className="footer-link">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;