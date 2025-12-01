import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css" // Asegúrate de importar tu archivo CSS

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Lógica para el botón, por ejemplo, navegar a la página de registro o servicios
    navigate('/reservar'); // Reemplaza con la ruta deseada
  };

  return (
    <div className="home-container">
      <div className="home-left-column">
        <h1 className="home-title">
          El cuerpo es tu templo
        </h1>
        <p className="home-description">
          Bienvenido a la herramienta que hará que tu proceso de mejora constante
          se haga mas ameno. Comienza a reservar tus clases hoy con MusculaTech.
          La solución definitiva para tu gimnasio.
        </p>
        <button className="home-button" onClick={handleButtonClick}>
          ¡A que esperas!
        </button>
      </div>
      <div className="home-right-column">
        {/* Esta columna permanece vacía como se solicitó */}
      </div>
    </div>
  );
};

export default Home;