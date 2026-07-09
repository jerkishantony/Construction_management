import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  Fade,
  Grow,
  Alert,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EngineeringIcon from "@mui/icons-material/Engineering";
import ConstructionIcon from "@mui/icons-material/Construction";

import authService from "../../services/authService";

const COLORS = {
  navy: "#161821",
  navyLight: "#1F2230",
  accent: "#C9A66B",
  accentDark: "#a9884f",
};

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authService.login({ username, password });
localStorage.setItem("access_token", response.data.access_token);

localStorage.setItem("user", JSON.stringify(response.data.user));

localStorage.setItem("role", response.data.user.role);
localStorage.setItem("role_id", response.data.user.role_id);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${COLORS.navy} 0%, #0d0e13 100%)`,
      }}
    >
      {/* Decorative construction icons floating in background */}
      <ConstructionIcon
        sx={{
          position: "absolute",
          fontSize: 220,
          color: "rgba(201, 166, 107, 0.06)",
          top: "-40px",
          left: "-40px",
          transform: "rotate(-15deg)",
        }}
      />
      <EngineeringIcon
        sx={{
          position: "absolute",
          fontSize: 260,
          color: "rgba(201, 166, 107, 0.05)",
          bottom: "-60px",
          right: "-60px",
          transform: "rotate(10deg)",
        }}
      />

      {/* Diagonal accent stripes (construction hazard style, subtle) */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "6px",
          background: `repeating-linear-gradient(45deg, ${COLORS.accent}, ${COLORS.accent} 12px, ${COLORS.navy} 12px, ${COLORS.navy} 24px)`,
          opacity: 0.7,
        }}
      />

      <Grow in timeout={600}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 420,
            mx: 2,
            borderRadius: 4,
            position: "relative",
            zIndex: 1,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            border: `1px solid rgba(201, 166, 107, 0.15)`,
            overflow: "visible",
          }}
        >
          {/* Floating icon badge */}
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
              boxShadow: "0 8px 20px rgba(201, 166, 107, 0.4)",
              position: "absolute",
              top: -36,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <EngineeringIcon sx={{ fontSize: 36, color: "#161821" }} />
          </Box>

          <CardContent sx={{ pt: 6, pb: 4, px: 4 }}>
            <Typography
              variant="h4"
              align="center"
              fontWeight="bold"
              sx={{ color: COLORS.navy, letterSpacing: "-0.5px" }}
            >
              Construction ERP
            </Typography>

            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              mb={4}
            >
              Login in to manage your projects
            </Typography>

            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: COLORS.accentDark }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: COLORS.accent },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: COLORS.accentDark },
              }}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: COLORS.accentDark }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: COLORS.accent },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: COLORS.accentDark },
              }}
            />

            <Fade in={Boolean(error)} unmountOnExit>
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            </Fade>

            <Button
              fullWidth
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.3,
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: 16,
                color: COLORS.navy,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark})`,
                boxShadow: "0 6px 16px rgba(201, 166, 107, 0.35)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${COLORS.accentDark}, ${COLORS.accent})`,
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 22px rgba(201, 166, 107, 0.45)",
                },
                "&:disabled": {
                  background: "rgba(201, 166, 107, 0.4)",
                },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
}

export default LoginPage;