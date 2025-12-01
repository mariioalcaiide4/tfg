import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Creamos el contexto (la nube de datos)
export const AuthContext = createContext();

// 2. Creamos el Proveedor (el componente que envuelve a toda la app)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al arrancar la App, miramos si ya había un usuario guardado en el navegador
  useEffect(() => {
    const storedUid = localStorage.getItem("usuarioId");
    if (storedUid) {
      // Si hay ID, simulamos que el usuario está "dentro"
      setUser({ uid: storedUid });
    }
    setLoading(false);
  }, []);

  // Función para Loguearse (guardamos el ID)
  const login = (uid) => {
    localStorage.setItem("usuarioId", uid);
    setUser({ uid: uid });
  };

  // Función para Salir (borramos el ID)
  const logout = () => {
    localStorage.removeItem("usuarioId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizado para usar esto fácil en cualquier componente
// Podrás poner: const { user, login } = useAuth();
export const useAuth = () => {
  return useContext(AuthContext);
};