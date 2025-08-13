import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Paper, Typography, Box, TextField, Button, CircularProgress, Snackbar, Alert, Stack } from '@mui/material';
import logo from '../../assets/logo.png';
import authService from '../../services/auth';

export default function TransferPage() {
  const [form, setForm] = useState({ to_account_number: '', amount: '' });
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState('info');
  const [submitting, setSubmitting] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [lookupError, setLookupError] = useState('');
  const debounceRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const acct = form.to_account_number.trim();
    setRecipient(null);
    setLookupError('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!acct || acct.length < 6) return; // basic threshold
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await authService.resolveAccount(acct);
        setRecipient(data);
        setLookupError('');
      } catch (err) {
        setRecipient(null);
        if (acct === form.to_account_number.trim()) {
          setLookupError(err.response?.data?.error || 'Account not found');
        }
      }
    }, 400);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [form.to_account_number]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setSeverity('info');
    setSubmitting(true);
    try {
      const res = await authService.transferMoney(form);
      setMsg(res.success || 'Transfer successful');
      setSeverity('success');
      setForm({ to_account_number: '', amount: '' });
    } catch (err) {
      setMsg(err.response?.data?.error || 'Transfer failed');
      setSeverity('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'rgba(12,18,40,0.6)', border: '1px solid rgba(45,127,249,0.25)', boxShadow: '0 0 24px rgba(45,127,249,0.2)', maxWidth: 720, mx: 'auto', position: 'relative' }}>
      <Typography variant="h4" sx={{ color: '#eaf2ff', fontWeight: 800, mb: 1 }}>Transfer</Typography>
      <Typography sx={{ color: '#9fb4ff', mb: 3 }}>Send money securely by account number.</Typography>
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2, maxWidth: 520 }}>
        <TextField fullWidth label="Recipient Account Number" name="to_account_number" value={form.to_account_number} onChange={onChange} required disabled={submitting} helperText={recipient ? `Name: ${recipient.username} (${recipient.email})` : (lookupError || ' ')} FormHelperTextProps={{ sx: { color: recipient ? '#9fb4ff' : '#ffbcbc' } }} />
        <TextField fullWidth type="number" label="Amount" name="amount" value={form.amount} onChange={onChange} required disabled={submitting} inputProps={{ min: 0.01, step: 0.01 }} />
        <Button type="submit" variant="contained" disabled={submitting} sx={{ py: 1.2, fontWeight: 700, boxShadow: '0 0 16px rgba(45,127,249,0.45)' }}>
          {submitting ? (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CircularProgress size={20} sx={{ color: '#eaf2ff' }} />
              <Typography sx={{ color: '#eaf2ff', fontWeight: 800, letterSpacing: 1 }}>K9TX</Typography>
            </Stack>
          ) : (
            'Send'
          )}
        </Button>
      </Box>
      <Snackbar
        open={!!msg}
        autoHideDuration={3000}
        onClose={() => setMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setMsg('')} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
