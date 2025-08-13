import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Button, Stack } from '@mui/material';
import authService from '../../services/auth';

export default function BalancePage() {
  const [balance, setBalance] = useState(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await authService.getBalance();
      setBalance(res.balance);
      setUpdatedAt(new Date());
      const user = authService.getCurrentUser();
      if (user) {
        const updatedUser = { ...user, balance: res.balance };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setAccountNumber(updatedUser.account_number || '');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setBalance(user.balance);
      setAccountNumber(user.account_number || '');
    }
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'rgba(12,18,40,0.6)', border: '1px solid rgba(45,127,249,0.25)', boxShadow: '0 0 24px rgba(45,127,249,0.2)', maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h4" sx={{ color: '#eaf2ff', fontWeight: 800, mb: 1 }}>Account Balance</Typography>
      <Typography sx={{ color: '#9fb4ff', mb: 3 }}>Your account details and current balance</Typography>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography sx={{ color: '#bcd3ff' }}>Account Number</Typography>
        <Typography variant="h6" sx={{ color: '#eaf2ff', fontWeight: 700 }}>{accountNumber || '—'}</Typography>
      </Stack>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography sx={{ color: '#bcd3ff' }}>Current Balance</Typography>
        <Typography variant="h3" sx={{ color: '#eaf2ff', fontWeight: 800 }}>₹{balance ?? '—'}</Typography>
        {updatedAt && (
          <Typography variant="caption" sx={{ color: '#9fb4ff' }}>Updated {updatedAt.toLocaleTimeString()}</Typography>
        )}
      </Stack>
      <Box>
        
      </Box>
    </Paper>
  );
}
