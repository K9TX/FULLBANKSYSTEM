import React, { useEffect, useMemo, useState } from 'react';
import { Paper, Typography, Box, TextField, Button, Divider, Chip } from '@mui/material';
import authService from '../../services/auth';

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({ amount: '', term_months: '', purpose: '', interest_rate: '10.00' });
  const me = authService.getCurrentUser();
  const isAdmin = !!me?.is_staff;

  const load = async () => {
    try {
      const data = await authService.getLoans();
      setLoans(Array.isArray(data) ? data : []);
    } catch { setLoans([]); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    const term = parseInt(form.term_months, 10);
    const rate = parseFloat(form.interest_rate);
    if (!amount || amount <= 0 || !term || term <= 0 || !rate || rate <= 0) return;
    try {
      await authService.applyLoan({ amount, term_months: term, purpose: form.purpose, interest_rate: rate });
      setForm({ amount: '', term_months: '', purpose: '', interest_rate: '10.00' });
      load();
    } catch {}
  };

  const act = async (loanId, action) => {
    try {
      await authService.actOnLoan(loanId, action);
      load();
    } catch {}
  };

  const statusColor = (s) => {
    if (s === 'APPROVED') return 'success';
    if (s === 'REJECTED') return 'error';
    return 'warning';
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'rgba(12,18,40,0.6)', border: '1px solid rgba(45,127,249,0.25)', boxShadow: '0 0 24px rgba(45,127,249,0.2)', maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ color: '#eaf2ff', fontWeight: 800, mb: 1 }}>Loans</Typography>
      <Typography sx={{ color: '#9fb4ff', mb: 3 }}>Apply for a loan and track status{isAdmin ? '; review all applications' : ''}</Typography>

      {!isAdmin && (
        <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2, maxWidth: 600, mb: 3 }}>
          <TextField
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <TextField
            label="Term (months)"
            type="number"
            value={form.term_months}
            onChange={(e) => setForm({ ...form, term_months: e.target.value })}
            required
          />
          <TextField
            label="Interest rate (% p.a.)"
            type="number"
            inputProps={{ step: '0.01' }}
            value={form.interest_rate}
            onChange={(e) => setForm({ ...form, interest_rate: e.target.value })}
            required
          />
          <TextField
            label="Purpose"
            multiline
            rows={3}
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />
          <Button type="submit" variant="contained" sx={{ py: 1.1, fontWeight: 700, boxShadow: '0 0 16px rgba(45,127,249,0.45)' }}>Apply</Button>
        </Box>
      )}

      <Box>
        {loans.length === 0 ? (
          <Typography sx={{ color: '#bcd3ff' }}>No loan applications.</Typography>
        ) : (
          loans.map((l, idx) => (
            <Box key={l.id}>
              <Box sx={{ py: 1.5 }}>
                <Typography sx={{ color: '#eaf2ff', fontWeight: 600 }}>
                  ₹{l.amount} for {l.term_months} months @ {l.interest_rate}% {isAdmin && `(by ${l.applicant_username || l.applicant})`}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip label={l.status} color={statusColor(l.status)} size="small" />
                  {l.status === 'PENDING' && isAdmin && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" color="success" onClick={() => act(l.id, 'approve')}>Approve</Button>
                      <Button size="small" variant="outlined" color="error" onClick={() => act(l.id, 'reject')}>Reject</Button>
                    </Box>
                  )}
                </Box>
                {l.purpose && (
                  <Typography sx={{ color: '#9fb4ff', mt: 0.5 }}>Purpose: {l.purpose}</Typography>
                )}
              </Box>
              {idx < loans.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />}
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}


