import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import authService from '../../services/auth';

export default function TransactionsPage() {
  const [items, setItems] = useState([]);
  const me = authService.getCurrentUser();
  const myId = me?.id;

  const load = async () => {
    try {
      const data = await authService.getTransactions();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); }
  };

  useEffect(() => { load(); }, []);

  const renderLine = (t) => {
    if (t.type === 'TRANSFER') {
      const isIncoming = t.to_user === myId;
      const isOutgoing = t.from_user === myId;
      if (isIncoming) return `Received from ${t.from_username || '-'} `;
      if (isOutgoing) return `Sent to ${t.to_username || '-'} `;
      return `Transfer`; // fallback
    }
    if (t.type === 'DEPOSIT') {
      return 'Deposit';
    }
    if (t.type === 'LOAN') {
      return 'Loan credited';
    }
    return t.type;
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'rgba(12,18,40,0.6)', border: '1px solid rgba(45,127,249,0.25)', boxShadow: '0 0 24px rgba(45,127,249,0.2)', maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ color: '#eaf2ff', fontWeight: 800, mb: 1 }}>Transactions</Typography>
      <Typography sx={{ color: '#9fb4ff', mb: 3 }}>Your recent activity</Typography>
      <Box className="no-scroll" sx={{ maxHeight: '60vh', overflow: 'auto' }}>
        {items.length === 0 ? (
          <Typography sx={{ color: '#bcd3ff' }}>No transactions.</Typography>
        ) : (
          items.map((t, idx) => (
            <Box key={t.id}>
              <Box sx={{ py: 1.5 }}>
                <Typography sx={{ color: '#eaf2ff', fontWeight: 600 }}>
                  {renderLine(t)}: ₹{t.amount}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9fb4ff' }}>{new Date(t.created_at).toLocaleString()}</Typography>
              </Box>
              {idx < items.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />}
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}
