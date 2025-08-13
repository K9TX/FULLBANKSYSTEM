import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, TextField, Button, Divider, Avatar, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import authService from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', content: '', imageFile: null });
  const [commentsByBlog, setCommentsByBlog] = useState({});
  const [commentInputByBlog, setCommentInputByBlog] = useState({});
  const [replyInputByComment, setReplyInputByComment] = useState({});

  const load = async () => {
    try {
      const data = await authService.getBlogs();
      setBlogs(Array.isArray(data) ? data : []);
    } catch { setBlogs([]); }
  };

  useEffect(() => { load(); }, []);

  // Auto-refresh blogs every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      load();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Load comments for all blogs when list updates
    const fetchAll = async () => {
      const entries = await Promise.all(
        blogs.map(async (b) => {
          try {
            const comments = await authService.getComments(b.id);
            return [b.id, comments];
          } catch {
            return [b.id, []];
          }
        })
      );
      const map = Object.fromEntries(entries);
      setCommentsByBlog(map);
    };
    if (blogs.length) fetchAll();
  }, [blogs]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.createBlog(form);
      setForm({ title: '', content: '', imageFile: null });
      load();
    } catch {}
  };

  const submitComment = async (blogId) => {
    const content = (commentInputByBlog[blogId] || '').trim();
    if (!content) return;
    try {
      const created = await authService.addComment({ blogId, content });
      setCommentsByBlog((prev) => ({
        ...prev,
        [blogId]: [...(prev[blogId] || []), created],
      }));
      setCommentInputByBlog((prev) => ({ ...prev, [blogId]: '' }));
    } catch {}
  };

  const submitReply = async (blogId, parentId) => {
    const content = (replyInputByComment[parentId] || '').trim();
    if (!content) return;
    try {
      const created = await authService.addComment({ blogId, content, parent: parentId });
      // Append reply under parent in-place
      setCommentsByBlog((prev) => {
        const updated = (prev[blogId] || []).map((c) => {
          if (c.id === parentId) {
            const replies = Array.isArray(c.replies) ? c.replies : [];
            return { ...c, replies: [...replies, created] };
          }
          return c;
        });
        return { ...prev, [blogId]: updated };
      });
      setReplyInputByComment((prev) => ({ ...prev, [parentId]: '' }));
    } catch {}
  };

  const renderComments = (blogId, comments = [], depth = 0) => (
    <Box sx={{ ml: depth ? 3 : 0 }}>
      {comments.map((c, idx) => (
        <Box key={c.id} sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={c.author_profile_image_url || ''} sx={{ width: 24, height: 24 }} />
            <Typography sx={{ color: '#eaf2ff', fontWeight: 600, fontSize: 14 }}>
              {c.author_username}
            </Typography>
          </Box>
          <Typography sx={{ color: '#bcd3ff', mb: 1, mt: 0.5 }}>{c.content}</Typography>
          {depth < 1 && (
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder="Write a reply"
                value={replyInputByComment[c.id] || ''}
                onChange={(e) => setReplyInputByComment((prev) => ({ ...prev, [c.id]: e.target.value }))}
                sx={{ flex: 1 }}
              />
              <Button variant="outlined" onClick={() => submitReply(blogId, c.id)}>Reply</Button>
            </Box>
          )}
          {Array.isArray(c.replies) && c.replies.length > 0 && renderComments(blogId, c.replies, depth + 1)}
          {idx < comments.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 1 }} />}
        </Box>
      ))}
    </Box>
  );

  const handleDeleteBlog = async (blogId) => {
    try {
      await authService.deleteBlog(blogId);
      setBlogs(prev => prev.filter(b => b.id !== blogId));
    } catch {}
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, background: 'rgba(12,18,40,0.6)', border: '1px solid rgba(45,127,249,0.25)', boxShadow: '0 0 24px rgba(45,127,249,0.2)', maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ color: '#eaf2ff', fontWeight: 800, mb: 1 }}>Blogs</Typography>
      <Typography sx={{ color: '#9fb4ff', mb: 3 }}>Share updates and read from others</Typography>
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2, mb: 3, maxWidth: 720 }}>
        <TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <TextField fullWidth multiline rows={4} label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        <Button component="label" variant="outlined" sx={{ justifyContent: 'flex-start' }}>
          {form.imageFile ? `Image: ${form.imageFile.name}` : 'Attach image (optional)'}
          <input hidden type="file" accept="image/*" onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })} />
        </Button>
        <Button type="submit" variant="contained" sx={{ py: 1.1, fontWeight: 700, boxShadow: '0 0 16px rgba(45,127,249,0.45)' }}>Post</Button>
      </Box>
      <Box className="scroll-container" sx={{ maxHeight: '60vh', overflow: 'auto', pr: 1 }}>
        {blogs.map((b, idx) => (
          <Box key={b.id}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={b.author_profile_image_url || ''} sx={{ width: 28, height: 28 }} />
                <Typography variant="h6" sx={{ color: '#eaf2ff', fontWeight: 700 }}>{b.title}</Typography>
              </Box>
              <Typography sx={{ color: '#bcd3ff', mb: 0.5, mt: 0.5 }}>{b.content}</Typography>
              {b.image_url && (
                <Box sx={{ mt: 1 }}>
                  <Box
                    component="img"
                    src={b.image_url}
                    alt={b.title}
                    sx={{
                      width: '50%',
                      maxHeight: { xs: 100, sm: 660 },
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid rgba(45,127,249,0.25)'
                    }}
                  />
                </Box>
              )}
              <Typography variant="caption" sx={{ color: '#9fb4ff' }}>by {b.author_username}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Write a comment"
                  value={commentInputByBlog[b.id] || ''}
                  onChange={(e) => setCommentInputByBlog((prev) => ({ ...prev, [b.id]: e.target.value }))}
                />
                <Button variant="outlined" onClick={() => submitComment(b.id)}>Comment</Button>
              </Box>
              {user?.is_staff && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Tooltip title="Delete blog">
                    <IconButton size="small" onClick={() => handleDeleteBlog(b.id)}>
                      <DeleteIcon sx={{ color: '#ff6b6b' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              <Box sx={{ mt: 1.5 }}>
                {renderComments(b.id, commentsByBlog[b.id] || [])}
              </Box>
            </Box>
            {idx < blogs.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 2 }} />}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
