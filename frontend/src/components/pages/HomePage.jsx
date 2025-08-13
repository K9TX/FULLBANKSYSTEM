import React from 'react';
import { Paper, Typography, Box, Button, Grid, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import logo from '../../assets/logo.png';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BoltIcon from '@mui/icons-material/Bolt';
import InsightsIcon from '@mui/icons-material/Insights';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArticleIcon from '@mui/icons-material/Article';

export default function HomePage() {
  return (
    <Box sx={{ position: 'relative' }}>
      {/* Hero */}
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(12,18,40,0.9) 0%, rgba(10,22,54,0.95) 100%)',
          border: '1px solid rgba(45,127,249,0.25)',
          boxShadow: '0 0 36px rgba(45,127,249,0.25), inset 0 0 28px rgba(45,127,249,0.12)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient ribbon */}
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -120,
            width: 360,
            height: 160,
            background: 'linear-gradient(90deg, rgba(45,127,249,0.35), rgba(106,160,255,0.15))',
            filter: 'blur(42px)',
            transform: 'rotate(-12deg)',
            '@keyframes sweep': {
              '0%': { opacity: 0.35, transform: 'rotate(-12deg) translateX(0)' },
              '50%': { opacity: 0.55, transform: 'rotate(-12deg) translateX(-12px)' },
              '100%': { opacity: 0.35, transform: 'rotate(-12deg) translateX(0)' },
            },
            animation: 'sweep 8s ease-in-out infinite',
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box component="img" src={logo} alt="K9TX Bank" sx={{ height: 40, width: 'auto' }} />
          <Typography variant="h4" sx={{ color: '#eaf2ff', fontWeight: 800 }}>
            K9TX Bank
          </Typography>
        </Box>
        <Typography sx={{ color: '#9fb4ff', mb: 3, maxWidth: 920 }}>
          A modern, secure, and lightning-fast digital bank managed and owned by K9TX Capital Management. 
          Experience seamless transfers, transparent insights, and robust protection for your assets.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Button
            component={Link}
            to="/app/deposit"
            variant="contained"
            startIcon={<AttachMoneyIcon />}
            sx={{
              position: 'relative',
              py: 1.15,
              px: 2.4,
              fontWeight: 800,
              letterSpacing: 0.4,
              color: '#0b1020',
              background: 'linear-gradient(90deg, #60a5fa 0%, #2d7ff9 50%, #60a5fa 100%)',
              backgroundSize: '200% 200%',
              boxShadow: '0 0 18px rgba(45,127,249,0.55), 0 0 36px rgba(45,127,249,0.25)',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
              animation: 'gradientShift 6s ease infinite, neonPulse 3s ease-in-out infinite',
              '@keyframes gradientShift': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
              '@keyframes neonPulse': {
                '0%, 100%': { boxShadow: '0 0 14px rgba(45,127,249,0.45), 0 0 28px rgba(45,127,249,0.2)' },
                '50%': { boxShadow: '0 0 22px rgba(45,127,249,0.75), 0 0 44px rgba(45,127,249,0.35)' },
              },
              '&:hover': {
                transform: 'translateY(-1px) scale(1.01)',
                boxShadow: '0 0 24px rgba(45,127,249,0.75), 0 0 48px rgba(45,127,249,0.45)',
              },
            }}
          >
            Deposit
          </Button>
          <Button
            component={Link}
            to="/app/transfer"
            variant="outlined"
            startIcon={<SwapHorizIcon />}
            sx={{
              position: 'relative',
              py: 1.05,
              px: 2.2,
              color: '#e9d5ff',
              borderColor: 'rgba(139,92,246,0.85)',
              boxShadow: '0 0 14px rgba(139,92,246,0.45)',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
              animation: 'neonPulsePurple 3.2s ease-in-out infinite',
              '@keyframes neonPulsePurple': {
                '0%, 100%': { boxShadow: '0 0 12px rgba(139,92,246,0.4)' },
                '50%': { boxShadow: '0 0 24px rgba(139,92,246,0.8)' },
              },
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 0 26px rgba(139,92,246,0.9)',
                borderColor: 'rgba(139,92,246,1)',
              },
            }}
          >
            Transfer
          </Button>
          <Button
            component={Link}
            to="/app/transactions"
            variant="outlined"
            startIcon={<ReceiptLongIcon />}
            sx={{
              position: 'relative',
              py: 1.05,
              px: 2.2,
              color: '#cffafe',
              borderColor: 'rgba(34,211,238,0.85)',
              boxShadow: '0 0 14px rgba(34,211,238,0.45)',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
              animation: 'neonPulseCyan 3.2s ease-in-out infinite',
              '@keyframes neonPulseCyan': {
                '0%, 100%': { boxShadow: '0 0 12px rgba(34,211,238,0.4)' },
                '50%': { boxShadow: '0 0 24px rgba(34,211,238,0.8)' },
              },
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 0 26px rgba(34,211,238,0.95)',
                borderColor: 'rgba(34,211,238,1)',
              },
            }}
          >
            Transactions
          </Button>
          <Button
            component={Link}
            to="/app/blogs"
            variant="outlined"
            startIcon={<ArticleIcon />}
            sx={{
              position: 'relative',
              py: 1.05,
              px: 2.2,
              color: '#ffedd5',
              borderColor: 'rgba(245,158,11,0.9)',
              boxShadow: '0 0 14px rgba(245,158,11,0.4)',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
              animation: 'neonPulseAmber 3.2s ease-in-out infinite',
              '@keyframes neonPulseAmber': {
                '0%, 100%': { boxShadow: '0 0 12px rgba(245,158,11,0.35)' },
                '50%': { boxShadow: '0 0 24px rgba(245,158,11,0.75)' },
              },
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 0 26px rgba(245,158,11,0.95)',
                borderColor: 'rgba(245,158,11,1)',
              },
            }}
          >
            Blogs
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {[
            { icon: <VerifiedUserIcon sx={{ color: '#7dd3fc' }} />, title: 'Secure by Design', desc: 'Multi-layer security with JWT auth and robust protections.' },
            { icon: <BoltIcon sx={{ color: '#facc15' }} />, title: 'Real-time Speed', desc: 'Instant balance updates and swift transactions.' },
            { icon: <InsightsIcon sx={{ color: '#86efac' }} />, title: 'Clear Insights', desc: 'Transparent history and activity overview.' },
          ].map((f) => (
            <Grid item xs={12} sm={4} key={f.title}>
              <Box
                sx={{
                  p: 2.2,
                  borderRadius: 2,
                  border: '1px solid rgba(45,127,249,0.2)',
                  background: 'rgba(12,18,40,0.55)',
                  boxShadow: '0 0 16px rgba(45,127,249,0.15)',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                  {f.icon}
                  <Typography sx={{ color: '#eaf2ff', fontWeight: 700 }}>{f.title}</Typography>
                </Box>
                <Typography sx={{ color: '#bcd3ff', fontSize: 14 }}>{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* About section */}
      <Paper
        sx={{
          mt: 3,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(9,18,40,0.85) 0%, rgba(11,25,55,0.9) 100%)',
          border: '1px solid rgba(45,127,249,0.2)',
          boxShadow: '0 0 26px rgba(45,127,249,0.18)',
        }}
      >
        <Typography variant="h5" sx={{ color: '#eaf2ff', fontWeight: 800, mb: 1 }}>
          About K9TX Bank
        </Typography>
        <Typography sx={{ color: '#9fb4ff', mb: 2 }}>
          K9TX Bank is a next-generation digital banking experience by K9TX Capital Management. 
          Our mission is to deliver simple, secure and elegant tools for managing your money. 
          With transparent activity, helpful insights and a delightful interface, we make banking feel effortless.
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 1.5 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Stat label="Uptime" value="99.9%" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stat label="Transfers/day" value="Fast" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stat label="Security" value="Hardened" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stat label="Support" value="Friendly" />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

function Stat({ label, value }) {
  return (
    <Box sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(45,127,249,0.18)', background: 'rgba(12,18,40,0.5)', textAlign: 'center' }}>
      <Typography sx={{ color: '#eaf2ff', fontWeight: 800, fontSize: 20 }}>{value}</Typography>
      <Typography sx={{ color: '#9fb4ff', fontSize: 12 }}>{label}</Typography>
    </Box>
  );
}
