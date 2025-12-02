import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Box, Container, Paper, Typography, TextField, Button, Stack, 
    Divider, IconButton, InputAdornment, Alert, CircularProgress 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { auth } from '../firebase-config'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
// ----------------------------------------------------------

const RegisterPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Estado inicial
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: '' 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. PRIMERO: Creamos el usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                formData.email, 
                formData.password
            );
            
            // Obtenemos el UID que nos da Firebase (ej: "56EdV...")
            const firebaseUid = userCredential.user.uid;

            // 2. SEGUNDO: Preparamos los datos para Spring Boot
            // OJO: No enviamos la contraseña al backend, no la necesita.
            const userForBackend = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                telefono: formData.telefono,
                direccion: formData.direccion,
                fechaNacimiento: formData.fechaNacimiento, // Formato YYYY-MM-DD
                firebaseUid: firebaseUid, // ¡La clave de la sincronización!
                rol: "SOCIO" // O el rol que quieras por defecto
            };

            // 3. TERCERO: Guardamos en PostgreSQL llamando a tu API
            const response = await fetch('http://localhost:8084/api/usuarios/sincronizar', { // Revisa tu puerto y endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userForBackend)
            });

            if (response.ok) {
                // ¡Todo perfecto! Redirigimos al Login o al Home
                navigate('/login'); 
            } else {
                const errorText = await response.text();
                setError('Error en el servidor: ' + errorText);
                // Opcional: Aquí podrías borrar el usuario de Firebase si falla el backend para no dejar basura.
            }

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Ese email ya está registrado en Firebase.');
            } else {
                setError('Error en el registro: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 4 
        }}>
            <Container maxWidth="md">
                <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
                    
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <PersonAddIcon color="primary" sx={{ fontSize: 50 }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            Crear Cuenta
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            
                            {/* Nombre y Apellidos */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField fullWidth label="Nombre" name="nombre" onChange={handleChange} required />
                                <TextField fullWidth label="Apellido" name="apellido" onChange={handleChange} required />
                            </Stack>

                            {/* Datos de Contacto */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField fullWidth label="Email" name="email" type="email" onChange={handleChange} required />
                                <TextField fullWidth label="Teléfono" name="telefono" onChange={handleChange} required />
                            </Stack>

                            {/* Datos Personales */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField fullWidth label="Dirección" name="direccion" onChange={handleChange} required />
                                <TextField 
                                    fullWidth 
                                    label="Fecha Nacimiento" 
                                    name="fechaNacimiento" 
                                    type="date" 
                                    onChange={handleChange} 
                                    required 
                                    InputLabelProps={{ shrink: true }} 
                                />
                            </Stack>

                            <Divider sx={{ my: 1 }} />

                            {/* Contraseña */}
                            <TextField
                                fullWidth
                                label="Contraseña"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChange}
                                required
                                helperText="Mínimo 6 caracteres"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large" 
                                disabled={loading}
                                sx={{ py: 1.5, fontSize: '1.1rem', mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
                            </Button>
                        </Stack>
                    </form>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2">
                            ¿Ya tienes cuenta? <Link to="/login" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#1976d2' }}>Inicia sesión</Link>
                        </Typography>
                    </Box>

                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterPage;