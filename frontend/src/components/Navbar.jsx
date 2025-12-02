import React, { useState, useEffect, useContext } from "react";
import {
	AppBar,
	Toolbar,
	Box,
	Container,
	IconButton,
	Button,
	Menu,
	MenuItem,
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import logo3 from "../assets/logo3.png";
import { useAuth } from "../context/AuthContext";

// Contextos y componentes propios
import Login from "../pages/Login";

function HideOnScroll({ hasBanner = true, onMenuClick }) {
	const navigate = useNavigate();
	const theme = useTheme();
	const location = useLocation();
	const { t } = useTranslation();
	
  const { user, logout } = useAuth();

	// Estados
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null); // Menú usuario logueado
	const [anchorElAnon, setAnchorElAnon] = useState(null); // Menú anónimo
	const [loginRole, setLoginRole] = useState("CLIENT");

	const isMenuOpen = Boolean(anchorEl);


	// Efecto para abrir login desde URL params
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const shouldOpenLogin = params.get("login") === "true";
		const roleParam = params.get("role");

		if (shouldOpenLogin) {
			if (roleParam === "BIDDER" || roleParam === "CLIENT") {
				setLoginRole(roleParam);
			}
			setIsLoginOpen(true);
			navigate(location.pathname, { replace: true });
		}
	}, []);

	// Manejadores de eventos
	const handleAccountClick = (event) => {
		if (user) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorElAnon(event.currentTarget);
		}
	};

	const openAnonLogin = (role) => {
		setAnchorElAnon(null);
		setLoginRole(role);
		setIsLoginOpen(true);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setAnchorElAnon(null);
	};

	const handleLogout = () => {
        if (logout) logout(); 
        
        sessionStorage.clear();
        handleMenuClose();
        
        setTimeout(() => navigate("/", { replace: true }), 0);
    };

	const handleAccount = () => {
		handleMenuClose();
		navigate("/dashboard");
	};

	// --- ESTILOS ---
	// Definimos el color naranja de marca aquí para reutilizarlo o usar theme.palette.primary.main
	const BRAND_ORANGE = "#00ff6a";
	const TEXT_COLOR = "#333333";

	return (
		<>
			<AppBar
				position="fixed"
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
					bgcolor: "white",
					color: "text.primary",
					boxShadow: "none", // Quitamos sombra fuerte
					borderBottom: "1px solid #e0e0e0", // Borde sutil inferior
					top: 0,
					transition: "top 0.3s ease",
          left: 0,
          right: 0,
          m: 0,
          p: 0
				}}
			>
				<Container maxWidth="xl">
					<Toolbar disableGutters sx={{ 
                px: 2, 
                minHeight: { xs: '56px', md: '64px' }, // Altura estándar más compacta
                height: { xs: '56px', md: '64px' },    // Fuerza la altura
                display: 'flex',
                alignItems: 'center'
            }}>
						
						{/* --- IZQUIERDA: Logo + Menú hamburguesa --- */}
						<Box sx={{ display: "flex", alignItems: "center" }}>
								<IconButton
									edge="start"
									onClick={() => navigate(-1)}
									sx={{ mr: 1, color: BRAND_ORANGE }}
								>
								</IconButton>
							

							{location.pathname === "/reservar" && (
								<IconButton
									edge="end"
									color="inherit"
									aria-label="menu"
									onClick={onMenuClick}
									sx={{ ml: 1, mr: 2, display: { xs: "block", md: "none" } }}
								>
									<MenuIcon />
								</IconButton>
							)}

							<Box
								component="img"
								src={logo3}
								alt="Logo"
								width="118px"
								onClick={() => navigate("/")}
								sx={{ cursor: "pointer" }}
							/>
						</Box>

						{/* --- CENTRO: Menú navegación (Estilo Texto Limpio) --- */}
						<Box
							sx={{
								position: "absolute",
								left: "50%",
								transform: "translateX(-50%)",
								display: { xs: "none", sm: "flex" },
								alignItems: "center",
								gap: 1, // Espacio entre enlaces
							}}
						>
							{user?.role !== "ENTRENADOR" && (
								<Button
									onClick={() => navigate("/reservar")}
									sx={{
										fontWeight: 400,
										fontSize: "1rem",
										textTransform: "none", // No mayúsculas
										color: TEXT_COLOR,
										"&:hover": { 
											color: BRAND_ORANGE,
											bgcolor: "transparent" // Sin fondo gris al hover
										},
									}}
								>
									{"Clases"}
								</Button>
							)}

							{user && user.role === "ENTRENADOR" && (
								<Button
									onClick={() => navigate("/bidder/cost")}
									sx={{
										fontWeight: 400,
										fontSize: "1rem",
										textTransform: "none",
										color: TEXT_COLOR,
										"&:hover": { 
											color: BRAND_ORANGE, 
											bgcolor: "transparent"
										},
									}}
								>
									{"account_serviceManage_price"}
								</Button>
							)}

							{user && (user.role === "SOCIO" || user.role === "ENTRENADOR") && (
								<Button
									onClick={() => navigate("/dashboard")}
									sx={{
										fontWeight: 400,
										fontSize: "1rem",
										textTransform: "none",
										color: TEXT_COLOR,
										"&:hover": { 
											color: BRAND_ORANGE,
											bgcolor: "transparent"
										},
									}}
								>
									{t("account_title")}
								</Button>
							)}
						</Box>

						{/* --- DERECHA: Icono de usuario --- */}
						<Box sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
							
							{/* 2. Icono de Usuario (Estilo Naranja) */}
							<IconButton
								onClick={handleAccountClick}
								sx={{
									ml: 2, // Separación del idioma
									border: `1px solid ${BRAND_ORANGE}`,
									color: BRAND_ORANGE,
									padding: "6px",
									transition: "all 0.2s",
									"&:hover": {
										bgcolor: "rgba(255, 102, 0, 0.08)",
									},
								}}
							>
								<AccountCircle sx={{ fontSize: "28px" }}/>
							</IconButton>

							{/* Menú Usuario Logueado */}
							<Menu
								anchorEl={anchorEl}
								open={isMenuOpen}
								onClose={handleMenuClose}
								PaperProps={{
									elevation: 0,
									sx: {
										mt: 1.5,
										boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
										borderRadius: 2,
										minWidth: 160,
										border: "1px solid #eee"
									},
								}}
							>
								<MenuItem onClick={handleAccount} sx={{ fontSize: "0.95rem" }}>
									Mi cuenta
								</MenuItem>
								<MenuItem onClick={handleLogout} sx={{ fontSize: "0.95rem" }}>
									Cerrar sesión
								</MenuItem>
							</Menu>

							{/* Menú Usuario Anónimo (Login) */}
							<Menu
								anchorEl={anchorElAnon}
								open={Boolean(anchorElAnon)}
								onClose={() => setAnchorElAnon(null)}
								PaperProps={{
									elevation: 0,
									sx: {
										mt: 1.5,
										minWidth: 190,
										borderRadius: 2,
										boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
										border: "1px solid #eee"
									},
								}}
							>
								<MenuItem onClick={() => openAnonLogin("SOCIO")}>
									Acceso Socios
								</MenuItem>
								<MenuItem onClick={() => openAnonLogin("ENTRENADOR")}>
									Acceso Entrenadores
								</MenuItem>
							</Menu>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			<Login
				open={isLoginOpen}
				onClose={() => setIsLoginOpen(false)}
				role={loginRole}
			/>
		</>
	);
}

export default HideOnScroll;