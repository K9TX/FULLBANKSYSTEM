import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper,
    Link as MuiLink,
    Divider
} from '@mui/material';
import Footer from '../layout/Footer';
import logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            password2: '',
            phone_number: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Required')
                .min(3, 'Must be at least 3 characters'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .required('Required')
                .min(8, 'Must be at least 8 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    'Must contain at least one uppercase letter, one lowercase letter, and one number'
                ),
            password2: Yup.string()
                .required('Required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            phone_number: Yup.string()
                .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        }),
        onSubmit: async (values) => {
            try {
                await register(values);
                navigate('/login');
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to register');
            }
        },
    });

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                background:
                    'radial-gradient(1200px 600px at 10% -10%, rgba(45,127,249,0.18) 0%, transparent 60%), radial-gradient(1200px 600px at 90% 110%, rgba(45,127,249,0.22) 0%, transparent 60%), linear-gradient(120deg, #0b1020 0%, #0a1a3a 100%)',
            }}
        >
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Box sx={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', filter: 'blur(48px)', background: 'rgba(45,127,249,0.25)', top: 60, left: 60 }} />
                <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', filter: 'blur(56px)', background: 'rgba(26,58,116,0.25)', bottom: 60, right: 80 }} />

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
                        Create Account
                    </Typography>
                    <Typography sx={{ color: '#9fb4ff', textAlign: 'center', mb: 2 }}>
                        Join and start banking smarter
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
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.touched.username && Boolean(formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username}
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
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
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
                            autoComplete="new-password"
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
                        <TextField
                            margin="normal"
                            fullWidth
                            name="password2"
                            label="Confirm Password"
                            type="password"
                            id="password2"
                            autoComplete="new-password"
                            value={formik.values.password2}
                            onChange={formik.handleChange}
                            error={formik.touched.password2 && Boolean(formik.errors.password2)}
                            helperText={formik.touched.password2 && formik.errors.password2}
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
                            name="phone_number"
                            label="Phone Number"
                            type="tel"
                            id="phone_number"
                            autoComplete="tel"
                            value={formik.values.phone_number}
                            onChange={formik.handleChange}
                            error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                            helperText={formik.touched.phone_number && formik.errors.phone_number}
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
                                '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 28px rgba(45,127,249,0.65)' },
                            }}
                        >
                            Sign Up
                        </Button>
                        <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />
                        <Box sx={{ mt: 1 }}>
                            <MuiLink component={Link} to="/login" variant="body2" sx={{ color: '#bcd3ff' }}>
                                Already have an account? Sign in
                            </MuiLink>
                        </Box>
                    </Box>
                    </Paper>
                </Container>
            </Box>
            <Footer compact />
        </Box>
    );
};

export default Register; 