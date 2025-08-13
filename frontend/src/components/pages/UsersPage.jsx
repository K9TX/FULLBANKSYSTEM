import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  TextField,
  Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import authService from "../../services/auth";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedFor, setCopiedFor] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await authService.getUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const name = (u.username || u.email || "").toLowerCase();
    const acc = (u.account_number || "").toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return name.includes(q) || acc.includes(q);
  });

  const copy = async (text, who) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFor(who);
      setTimeout(() => setCopiedFor(""), 1500);
    } catch {}
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, background: 'rgba(12,18,40,0.6)', border: '1px solid rgba(45,127,249,0.25)', boxShadow: '0 0 24px rgba(45,127,249,0.2)', color: '#eaf2ff', mt: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Users Directory</Typography>
        <TextField
          size="small"
          placeholder="Search by name or account number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2, maxWidth: 420 }}
        />
        <Box className="scroll-container" sx={{ maxHeight: '60vh', overflow: 'auto', pr: 1 }}>
          {filtered.length === 0 ? (
            <Typography sx={{ color: '#bcd3ff' }}>No users found.</Typography>
          ) : (
            <List>
              {filtered.map((u, idx) => {
                const displayName = u.username || u.email || 'User';
                const acc = u.account_number || '-';
                const key = `${displayName}-${acc}-${idx}`;
                const isCopied = copiedFor === key;
                return (
                  <Box key={key}>
                    <ListItem
                      secondaryAction={
                        <Tooltip title={isCopied ? 'Copied' : 'Copy account number'}>
                          <IconButton edge="end" onClick={() => copy(acc, key)}>
                            {isCopied ? <CheckIcon sx={{ color: '#22c55e' }} /> : <ContentCopyIcon sx={{ color: '#bcd3ff' }} />}
                          </IconButton>
                        </Tooltip>
                      }
                      sx={{
                        borderRadius: 2,
                        '&:hover': { background: 'rgba(45,127,249,0.08)' },
                      }}
                    >
                      <ListItemText
                        primary={<Typography sx={{ color: '#eaf2ff', fontWeight: 700 }}>{displayName}</Typography>}
                        secondary={<Typography sx={{ color: '#9fb4ff' }}>{acc}</Typography>}
                      />
                    </ListItem>
                    {idx < filtered.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', ml: 2 }} />}
                  </Box>
                );
              })}
            </List>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UsersPage;
