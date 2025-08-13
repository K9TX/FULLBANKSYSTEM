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
    Link as MuiLink
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const VerifyOTP = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { verifyOTP } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: '',
            new_password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            otp: Yup.string()
                .required('Required')
                .matches(/^\d{6}$/, 'OTP must be exactly 6 digits'),
            new_password: Yup.string()
                .required('Required')
                .min(8, 'Must be at least 8 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    'Must contain at least one uppercase letter, one lowercase letter, and one number'
                ),
        }),
        onSubmit: async (values) => {
            try {
                await verifyOTP(values);
                setSuccess('Password has been reset successfully');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to verify OTP');
            }
        },
    });

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Verify OTP
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
                            {success}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
                                color: '#213547 !important',
                                '& fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
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
                        <TextField
                            margin="normal"
                            fullWidth
                            id="otp"
                            label="OTP Code"
                            name="otp"
                            autoComplete="off"
                            value={formik.values.otp}
                            onChange={formik.handleChange}
                            error={formik.touched.otp && Boolean(formik.errors.otp)}
                            helperText={formik.touched.otp && formik.errors.otp}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: '#213547 !important',
                                '& fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
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
                        <TextField
                            margin="normal"
                            fullWidth
                            name="new_password"
                            label="New Password"
                            type="password"
                            id="new_password"
                            autoComplete="new-password"
                            value={formik.values.new_password}
                            onChange={formik.handleChange}
                            error={formik.touched.new_password && Boolean(formik.errors.new_password)}
                            helperText={formik.touched.new_password && formik.errors.new_password}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: '#213547 !important',
                                '& fieldset': { borderColor: 'rgba(0,0,0,0.2)' },
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
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Reset Password
                        </Button>
                        <Box sx={{ mt: 2 }}>
                            <MuiLink component={Link} to="/forgot-password" variant="body2">
                                Didn't receive OTP? Request again
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default VerifyOTP; 