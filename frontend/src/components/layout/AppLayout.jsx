import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SendIcon from '@mui/icons-material/Send';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ArticleIcon from '@mui/icons-material/Article';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useAuth } from '../../contexts/AuthContext';
import Footer from './Footer';
import logo from '../../assets/logo.png';

const drawerWidth = 260;
const miniWidth = 72;

export default function AppLayout() {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const location = useLocation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGlobalToggle = () => {
    if (isSmall) {
      setMobileOpen(prev => !prev);
    } else {
      setDesktopOpen(prev => !prev);
    }
  };

  const navItems = [
    { to: '/app', label: 'Home', icon: <DashboardIcon /> },
    { to: '/app/balance', label: 'Balance', icon: <AccountBalanceIcon /> },
    { to: '/app/deposit', label: 'Deposit', icon: <AccountBalanceWalletIcon /> },
    { to: '/app/transfer', label: 'Transfer', icon: <SendIcon /> },
    { to: '/app/transactions', label: 'Transactions', icon: <ListAltIcon /> },
    { to: '/app/users', label: 'Users', icon: <GroupIcon /> },
    { to: '/app/blogs', label: 'Blogs', icon: <ArticleIcon /> },
    { to: '/app/loans', label: 'Loans', icon: <RequestQuoteIcon /> },
    { to: '/app/profile', label: 'Profile', icon: <PersonIcon /> },
    { to: '/app/about', label: 'About', icon: <ArticleIcon /> },
  ];

  const isActive = (to) => location.pathname === to || (to === '/app' && location.pathname === '/app');

  // Close mobile drawer on route change
  React.useEffect(() => {
    if (isSmall) setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const drawer = (
    <div>
      <Toolbar sx={{
        background: 'linear-gradient(135deg, rgba(8,29,61,0.85) 0%, rgba(3,12,28,0.9) 100%)',
        color: '#eaf2ff',
        boxShadow: '0 0 24px rgba(45,127,249,0.35) inset',
        transition: 'padding 300ms ease',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <Box component="img" src={logo} alt="K9TX Bank" sx={{ height: 34, width: 'auto' }} />
        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: 800, letterSpacing: 1, opacity: desktopOpen ? 1 : 0, transition: 'opacity 200ms ease' }}
        >
          K9TX Bank
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <List sx={{ p: 1 }}>
        {navItems.map((item) => (
          <ListItem
            key={item.to}
            button
            component={Link}
            to={item.to}
            onClick={() => { if (isSmall) setMobileOpen(false); }}
            selected={isActive(item.to)}
            sx={{
              mb: 1,
              borderRadius: 2,
              color: '#bcd3ff',
              justifyContent: desktopOpen ? 'flex-start' : 'center',
              transition: 'background 200ms ease, box-shadow 200ms ease',
              '& .MuiListItemIcon-root': {
                color: isActive(item.to) ? '#2d7ff9' : '#5a7dbf',
                minWidth: 0,
                mr: desktopOpen ? 2 : 0,
                justifyContent: 'center'
              },
              '& .MuiListItemText-root': {
                opacity: desktopOpen ? 1 : 0,
                transition: 'opacity 200ms ease',
                whiteSpace: 'nowrap'
              },
              '&.Mui-selected': {
                background: 'linear-gradient(90deg, rgba(45,127,249,0.18) 0%, rgba(26,58,116,0.18) 100%)',
                boxShadow: '0 0 18px rgba(45,127,249,0.35)',
                color: '#eaf2ff',
              },
              '&:hover': {
                background: 'rgba(45,127,249,0.12)',
                boxShadow: '0 0 12px rgba(45,127,249,0.35)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
            {desktopOpen && <ListItemText primary={item.label} />}
          </ListItem>
        ))}
        <ListItem
          button
          onClick={logout}
          sx={{
            mt: 1,
            borderRadius: 2,
            color: '#ffbcbc',
            justifyContent: desktopOpen ? 'flex-start' : 'center',
            '& .MuiListItemIcon-root': { color: '#ff6b6b', minWidth: 0, mr: desktopOpen ? 2 : 0, justifyContent: 'center' },
            '& .MuiListItemText-root': { opacity: desktopOpen ? 1 : 0, transition: 'opacity 200ms ease' },
            '&:hover': { background: 'rgba(255,107,107,0.12)', boxShadow: '0 0 12px rgba(255,107,107,0.35)' }
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  const computedDrawerWidth = isSmall ? 0 : (desktopOpen ? drawerWidth : miniWidth);

  return (
    <Box className="no-scroll" sx={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      background: 'radial-gradient(1200px 600px at 10% -10%, rgba(45,127,249,0.18) 0%, transparent 60%), radial-gradient(1200px 600px at 90% 110%, rgba(45,127,249,0.2) 0%, transparent 60%), linear-gradient(120deg, #0b1020 0%, #0a1a3a 100%)',
      backgroundAttachment: 'fixed',
      overflowX: 'hidden'
    }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{
        width: { sm: `calc(100% - ${computedDrawerWidth}px)` },
        ml: { sm: `${computedDrawerWidth}px` },
        background: 'linear-gradient(90deg, rgba(9,18,40,0.9) 0%, rgba(13,27,60,0.9) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 0 18px rgba(45,127,249,0.25)',
        transition: 'width 300ms ease, margin 300ms ease',
        boxSizing: 'border-box'
      }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="toggle drawer" edge="start" onClick={handleGlobalToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ color: '#eaf2ff', fontWeight: 700 }}>
            {navItems.find(n => location.pathname.startsWith(n.to))?.label || 'Home'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: computedDrawerWidth }, flexShrink: { sm: 0 } }} aria-label="sidebar">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: '#0c1228', color: '#eaf2ff' } }}
        >
          {drawer}
        </Drawer>
        {/* Desktop Collapsible Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: computedDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: computedDrawerWidth,
              background: '#0c1228',
              color: '#eaf2ff',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              transition: 'width 300ms ease, box-shadow 300ms ease'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" className="scroll-container" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, width: { sm: `calc(100% - ${computedDrawerWidth}px)` }, overflow: 'auto', overflowX: 'hidden', transition: 'width 300ms ease', boxSizing: 'border-box', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Toolbar />
        <Box className="centered-container" sx={{ width: '100%', py: 2, overflow: 'hidden', flex: 1 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
