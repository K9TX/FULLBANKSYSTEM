import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, TextField, Button, Avatar, Divider } from '@mui/material';
import authService from '../../services/auth';

export default function ProfilePage() {
  const [me, setMe] = useState(null);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await authService.getMe();
      setMe(data);
      setUsername(data.username || '');
      setPhone(data.phone_number || '');
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      if (username !== me?.username) formData.append('username', username);
      if (phone !== me?.phone_number) formData.append('phone_number', phone);
      if (imageFile) formData.append('profile_image', imageFile);
      const updated = await authService.updateMe(formData);
      setMe(updated);
      setImageFile(null);
    } catch {}
    setSaving(false);
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'rgba(12,18,40,0.6)', border: '1px solid rgba(45,127,249,0.25)', boxShadow: '0 0 24px rgba(45,127,249,0.2)', maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" sx={{ color: '#eaf2ff', fontWeight: 800, mb: 1 }}>Profile</Typography>
      <Typography sx={{ color: '#9fb4ff', mb: 3 }}>View and update your details</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar src={me?.profile_image_url || ''} sx={{ width: 80, height: 80 }} />
        <Button component="label" variant="outlined">
          Select Image
          <input hidden type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </Button>
        {imageFile && <Typography sx={{ color: '#bcd3ff' }}>{imageFile.name}</Typography>}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />

      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Account Number" value={me?.account_number || ''} InputProps={{ readOnly: true }} />
        <TextField label="Email" value={me?.email || ''} InputProps={{ readOnly: true }} />
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Button onClick={onSave} disabled={saving} variant="contained" sx={{ py: 1.1, fontWeight: 700 }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
    </Paper>
  );
}


