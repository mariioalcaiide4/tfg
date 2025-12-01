import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Alert,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Snackbar,
  Slide
} from "@mui/material";
import {
  Close as CloseIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon
} from "@mui/icons-material";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase-config";
import { sincronizarUsuario } from "../services/api";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";


const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Login() {

  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState("SOCIO");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Manejadores
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/'); // Te devuelve a la home suavemente
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // --- LÓGICA DE SUBMIT (LOGIN Y REGISTRO) ---
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");

    try {
      let userCredential;
      if (isLogin) {
        
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        
        console.log("Usuario logueado:", userCredential.user);
        // Aquí podrías verificar en tu BD si el rol coincide si fuera necesario
      
      } else {
        // --- REGISTRO ---
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;

        console.log("Usuario creado en Firebase")

        await sincronizarUsuario({
            firebaseUid: user.uid,
            email: user.email,
            nombre: user.email.split("@")[0], // Usamos la primera parte del correo como nombre provisional
            rol: selectedRole, // 'SOCIO' o 'ENTRENADOR' (lo que hayas marcado en el Tab)
            activo: true
        });

        console.log("Usuario creado en PostgreSQL")
      }

      const uid = userCredential.user.uid;

      localStorage.setItem("usuarioId", uid)

      setOpenSnackbar(true);
      
      setTimeout(() => {
        handleClose();
        window.location.href = "/dashboard";
      }, 1000);

    } catch (error) {
      console.error("Error auth:", error);
      
      // Mapeo básico de errores de Firebase a mensajes amigables
      
      switch (error.code) {
        case "auth/email-already-in-use":
          setAuthError("El correo ya está registrado.");
          break;
        case "auth/invalid-email":
          setAuthError("Correo electrónico inválido.");
          break;
        case "auth/wrong-password":
        case "auth/user-not-found":
        case "auth/invalid-credential":
          setAuthError("Credenciales incorrectas.");
          break;
        case "auth/weak-password":
          setAuthError("La contraseña es muy débil.");
          break;
        default:
          setAuthError("Ocurrió un error. Inténtalo de nuevo.");
      }
    }
  };

  // Función para alternar entre Login y Registro
  const toggleAuthState = () => {
    setIsLogin(!isLogin);
    setAuthError("");
    setFormData({ ...formData, email: "", password: "" }); // Limpiar campos
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            zIndex: 1600,
            position: "relative",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            maxWidth: 540,
            width: "100%",
            maxHeight: "95vh",
          },
        }}
        sx={{
          zIndex: 1600,
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1599,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 4,
              borderRadius: 2,
            }}
          >
            {/* Botón de cerrar */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "text.secondary",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Icono (Cambia según si es Login o Registro) */}
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                bgcolor: isLogin ? "primary.main" : "secondary.main", // Cambia color según modo
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {isLogin ? (
                <LockIcon sx={{ fontSize: 36, color: "white" }} />
              ) : (
                <PersonAddIcon sx={{ fontSize: 36, color: "white" }} />
              )}
            </Box>

            {/* Título Dinámico */}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#00ff6a",
                mb: 4,
              }}
            >
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Typography>

            {/* Tabs de selección de rol */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Tabs
                value={selectedRole}
                onChange={(_, newValue) => setSelectedRole(newValue)}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: selectedRole === "SOCIO" ? "#003366" : "#FF6600",
                    height: "4px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <Tab
                  label="Socio"
                  value="SOCIO"
                  sx={{
                    color: selectedRole === "SOCIO" ? "#003366 !important" : "rgba(0,51,102,0.5) !important",
                    transition: "color 0.3s ease",
                  }}
                />
                <Tab
                  label="Entrenador"
                  value="ENTRENADOR"
                  sx={{
                    color: selectedRole === "ENTRENADOR" ? "#FF6600 !important" : "rgba(255,102,0,0.5) !important",
                    transition: "color 0.3s ease",
                  }}
                />
              </Tabs>
            </Box>

            {redirectMessage && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {redirectMessage}
              </Alert>
            )}

            {/* Caja del Formulario */}
            <Box
              sx={{
                p: 4,
                background: selectedRole === "SOCIO" ? "#f0f7ff" : "#fff4e0",
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                transition: "background 0.5s ease",
              }}
            >
              <TextField
                fullWidth
                label={"Email"}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                autoComplete="email"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label={"Contraseña"}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            bgcolor: "rgba(0,0,0,0.04)",
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Checkbox y Link de Olvidó contraseña */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label={"Recuérdame"}
                />
              </Box>

              {/* Botón de Acción Principal (Login o Registro) */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "secondary.main",
                  color: "white",
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": {
                    bgcolor: "secondary.dark",
                  },
                  mb: 2,
                }}
              >
                {isLogin ? "Iniciar sesión" : "Registrarse"}
              </Button>

              {authError && (
                <Typography
                  variant="body2"
                  color="error"
                  backgroundColor="rgba(255, 0, 0, 0.1)"
                  sx={{ mb: 1, textAlign: "center", p: 1, borderRadius: 1 }}
                >
                  {authError}
                </Typography>
              )}

              {/* Toggle entre Login y Registro */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {isLogin ? "Sin Loguear" : "¿Ya tienes una cuenta?"}{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={toggleAuthState}
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      fontWeight: "bold",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "primary.dark",
                      },
                    }}
                  >
                    {isLogin ? "Regístrate aquí" : "Inicia sesión"}
                  </Link>
                </Typography>
              </Box>
            </Box>

            {/* Copyright */}
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 4, textAlign: "center" }}
            >
              © {new Date().getFullYear()} TFG Mariano - Todos los derechos reservados.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar de éxito */}
      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
          }}
        >
          {isLogin 
            ? "Sesión iniciada correctamente" 
            : "Cuenta creada con éxito"}
        </MuiAlert>
      </Snackbar>
    </>
  );
}