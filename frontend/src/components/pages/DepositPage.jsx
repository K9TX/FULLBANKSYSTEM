import React, { useState } from 'react';
import { Paper, Typography, Box, TextField, Button } from '@mui/material';
import authService from '../../services/auth';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await authService.depositMoney(amount);
      setMsg(res.success || 'Deposit successful!');
      setAmount('');
    } catch (err) {
      setMsg(err.response?.data?.amount || 'Deposit failed');
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'rgba(12,18,40,0.6)', border: '1px solid rgba(45,127,249,0.25)', boxShadow: '0 0 24px rgba(45,127,249,0.2)', maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h4" sx={{ color: '#eaf2ff', fontWeight: 800, mb: 1 }}>Deposit</Typography>
      <Typography sx={{ color: '#9fb4ff', mb: 3 }}>Add funds to your account securely.</Typography>
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2, maxWidth: 520 }}>
        <TextField fullWidth type="number" label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required inputProps={{ min: 0.01, step: 0.01 }} />
        <Button type="submit" variant="contained" sx={{ py: 1.2, fontWeight: 700, boxShadow: '0 0 16px rgba(45,127,249,0.45)' }}>Deposit</Button>
      </Box>
      {msg && <Typography sx={{ color: '#bcd3ff', mt: 2 }}>{msg}</Typography>}
    </Paper>
  );
}
