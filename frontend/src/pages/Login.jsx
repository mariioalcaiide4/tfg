import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // Estado para guardar lo que escribes en el input
  const [uid, setUid] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 1. Guardamos el usuario en el contexto
    login(uid); 
    // 2. Redirigimos a la zona privada
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Iniciar Sesión (Modo TFG)</h2>
      <p>Pega aquí tu ID de Firebase para simular el login</p>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          type="text" 
          placeholder="Ej: 56EdVKhtKpc..." 
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
          ENTRAR
        </button>
      </form>
      
      <div style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>ID de prueba (Mariano):</p>
        <code>56EdVKhtKpc058EIE84x0unodoJ3</code>
      </div>
    </div>
  );
};

export default Login;