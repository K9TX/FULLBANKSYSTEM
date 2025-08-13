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
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

const ForgotPassword = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      setError("");
      setSuccess("");
      setSubmitting(true);
      try {
        await resetPassword(values.email);
        setSuccess("OTP sent to your email. Redirecting to verification...");
        setTimeout(() => {
          navigate("/verify-otp");
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to send OTP");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
              {success}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
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
              disabled={submitting}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#213547 !important',
                  '& fieldset': { borderColor: 'rgba(255, 238, 238, 0.2)' },
                  '&:hover fieldset': { borderColor: '#2d7ff9' },
                  '&.Mui-focused fieldset': { borderColor: '#2d7ff9' },
                },
                '& .MuiInputBase-input': {
                  color: '#213547 !important',
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: '#6b7280 !important',
                },
                '& .MuiInputLabel-root': { color: '#213547 !important' },
                '& .MuiFormHelperText-root': { color: '#6b7280 !important' },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
              sx={{ mt: 3, mb: 2, fontWeight: 800, letterSpacing: 1 }}
            >
              {submitting ? (
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
                  <Box component="span" className="spin" sx={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  K9TX
                </Box>
              ) : (
                'Send Reset OTP'
              )}
            </Button>
            <style>{`@keyframes spin {from {transform: rotate(0deg);} to {transform: rotate(360deg);} }`}</style>
            <Box sx={{ mt: 2 }}>
              <MuiLink component={Link} to="/login" variant="body2">
                Back to Sign In
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
