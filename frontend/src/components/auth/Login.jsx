import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import Footer from "../layout/Footer";
import logo from "../../assets/logo.png";

const Login = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        navigate("/app");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to login");
      }
    },
  });

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // Send the Google credential to your backend
      const res = await axios.post("http://localhost:8000/auth/social/login/", {
        provider: "google",
        access_token: credentialResponse.credential,
      });
      // Save token, redirect, etc.
      // Example: localStorage.setItem('token', res.data.access_token);
      window.location.href = "/app";
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background:
          'radial-gradient(1200px 600px at 10% -10%, rgba(45,127,249,0.18) 0%, transparent 60%), radial-gradient(1200px 600px at 90% 110%, rgba(45,127,249,0.22) 0%, transparent 60%), linear-gradient(120deg, #0b1020 0%, #0a1a3a 100%)',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Floating Orbs */}
        <Box sx={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', filter: 'blur(40px)', background: 'rgba(45,127,249,0.25)', top: 60, left: 60, animation: 'float 10s ease-in-out infinite' }} />
        <Box sx={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', filter: 'blur(50px)', background: 'rgba(26,58,116,0.25)', bottom: 60, right: 80, animation: 'float 12s ease-in-out infinite' }} />

        <Container maxWidth="xs" sx={{ position: 'relative' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(12,18,40,0.85) 0%, rgba(10,22,54,0.9) 100%)',
            border: '1px solid rgba(45,127,249,0.25)',
            boxShadow: '0 0 30px rgba(45,127,249,0.25), inset 0 0 24px rgba(45,127,249,0.12)',
            backdropFilter: 'blur(6px)',
          }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5, gap: 1.2 }}>
              <Box component="img" src={logo} alt="K9TX Bank" sx={{ height: 38, width: 'auto' }} />
              <Typography variant="h5" sx={{ color: '#eaf2ff', fontWeight: 900, letterSpacing: 0.5 }}>K9TX Bank</Typography>
            </Box>
          <Typography variant="h4" sx={{ color: '#eaf2ff', fontWeight: 800, textAlign: 'center' }}>
            Welcome Back
          </Typography>
          <Typography sx={{ color: '#9fb4ff', textAlign: 'center', mb: 2 }}>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#eaf2ff',
                  '& fieldset': { borderColor: 'rgba(155,180,255,0.25)' },
                  '&:hover fieldset': { borderColor: '#2d7ff9' },
                  '&.Mui-focused fieldset': { borderColor: '#2d7ff9', boxShadow: '0 0 12px rgba(45,127,249,0.35)' },
                },
                '& .MuiInputLabel-root': { color: '#9fb4ff' },
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#eaf2ff',
                  '& fieldset': { borderColor: 'rgba(155,180,255,0.25)' },
                  '&:hover fieldset': { borderColor: '#2d7ff9' },
                  '&.Mui-focused fieldset': { borderColor: '#2d7ff9', boxShadow: '0 0 12px rgba(45,127,249,0.35)' },
                },
                '& .MuiInputLabel-root': { color: '#9fb4ff' },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.2,
                fontWeight: 800,
                letterSpacing: 0.5,
                background: 'linear-gradient(90deg, #2d7ff9 0%, #6aa0ff 100%)',
                boxShadow: '0 6px 22px rgba(45,127,249,0.45)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 10px 28px rgba(45,127,249,0.65)',
                },
              }}
            >
              Sign In
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <MuiLink component={Link} to="/register" variant="body2" sx={{ color: '#bcd3ff' }}>
                {"Don't have an account? Sign Up"}
              </MuiLink>
              <MuiLink component={Link} to="/forgot-password" variant="body2" sx={{ color: '#bcd3ff' }}>
                Forgot password?
              </MuiLink>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(194, 54, 54, 0.99)' }}>or</Divider>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setError("Google login failed")} />
          </Box>
        </Paper>
        </Container>
      </Box>
      <Footer compact />
    </Box>
  );
};

export default Login;
