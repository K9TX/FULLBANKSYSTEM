import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';

export default function Footer({ compact = false }) {
  const year = new Date().getFullYear();
  return (
    <Box
      component="footer"
      sx={{
        mt: compact ? 2 : 4,
        px: 2,
        py: compact ? 1.5 : 2,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(90deg, rgba(9,18,40,0.6) 0%, rgba(13,27,60,0.6) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 -6px 18px rgba(45,127,249,0.15)',
      }}
    >
      <Typography sx={{ color: '#9fb4ff', textAlign: 'center', fontSize: 13 }}>
        © {year} <strong style={{ color: '#eaf2ff' }}>K9TX Bank</strong> · Managed and owned by{' '}
        <MuiLink href="#" underline="hover" sx={{ color: '#bcd3ff', fontWeight: 600 }}>
          K9TX Capital Management
        </MuiLink>
      </Typography>
    </Box>
  );
}


