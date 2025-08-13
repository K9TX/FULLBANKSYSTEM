import React from "react";
import { Container, Typography, Paper, Box, Grid, Stack, Divider, Chip, IconButton, Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import PublicIcon from "@mui/icons-material/Public";
import logo from "../../assets/logo.png";

const AboutPage = () => {
  return (
    <Container maxWidth="lg">
      <Paper
        sx={{
          p: { xs: 3, sm: 5 },
          mt: 4,
          borderRadius: 4,
          background: "rgba(12,18,40,0.6)",
          border: "1px solid rgba(45,127,249,0.25)",
          boxShadow: "0 0 24px rgba(45,127,249,0.2)",
          color: "#eaf2ff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box component="img" src={logo} alt="K9TX Bank" sx={{ height: 42, width: "auto" }} />
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
            About K9TX Banking
          </Typography>
        </Box>
        <Typography sx={{ color: "#9fb4ff", mb: 4 }}>
          A secure, modern digital banking experience focused on speed, clarity and trust.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Box sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(21,32,70,0.8), rgba(9,18,40,0.8))",
              border: "1px solid rgba(45,127,249,0.25)",
            }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Our Digital Banking Solution</Typography>
              <Typography sx={{ color: "#bcd3ff" }}>
                Seamless money management with deposits, transfers, transaction history, blogs and comments, and
                simple loan applications with admin review and instant credit on approval.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
                <Chip label="Deposits" color="primary" variant="outlined" sx={{ borderColor: "rgba(45,127,249,0.45)" }} />
                <Chip label="Transfers" color="primary" variant="outlined" sx={{ borderColor: "rgba(45,127,249,0.45)" }} />
                <Chip label="Transactions" color="primary" variant="outlined" sx={{ borderColor: "rgba(45,127,249,0.45)" }} />
                <Chip label="Loans" color="primary" variant="outlined" sx={{ borderColor: "rgba(45,127,249,0.45)" }} />
                <Chip label="Blogs & Comments" color="primary" variant="outlined" sx={{ borderColor: "rgba(45,127,249,0.45)" }} />
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(26,58,116,0.28), rgba(45,127,249,0.15))",
              border: "1px solid rgba(45,127,249,0.25)",
              height: "100%",
            }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Key Features</Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, color: "#bcd3ff" }}>
                <Typography component="li">Secure money transfers and deposits</Typography>
                <Typography component="li">Real-time balance and transaction history</Typography>
                <Typography component="li">Loan requests with admin approval</Typography>
                <Typography component="li">Community blogs with threaded comments</Typography>
                <Typography component="li">Profile management with avatars</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.08)" }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Box sx={{ p: 3, borderRadius: 3, background: "rgba(12,18,40,0.55)", border: "1px solid rgba(45,127,249,0.25)" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Security First</Typography>
              <Typography sx={{ color: "#bcd3ff" }}>
                We prioritize your security with strong password policies, OTP verification, and protected API endpoints.
                Data-in-transit is secured and user actions are authorized via JWT.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, rgba(45,127,249,0.18), rgba(26,58,116,0.18))",
              border: "1px solid rgba(45,127,249,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              height: "100%",
            }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Connect with us</Typography>
              <Typography sx={{ color: "#9fb4ff" }}>Follow updates and contribute.</Typography>
              <Stack direction="row" spacing={1}>
                <IconButton component="a" href="https://github.com/K9TX/CompleteBankSystem" target="_blank" rel="noopener" aria-label="GitHub" sx={{ color: "#eaf2ff" }}>
                  <GitHubIcon />
                </IconButton>
                <IconButton component="a" href="https://x.com/K9TXS" target="_blank" rel="noopener" aria-label="Twitter" sx={{ color: "#eaf2ff" }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton component="a" href="https://in.linkedin.com/in/k9tx" target="_blank" rel="noopener" aria-label="LinkedIn" sx={{ color: "#eaf2ff" }}>
                  <LinkedInIcon />
                </IconButton>
                <IconButton component="a" href="mailto:no-reply@example.com" aria-label="Email" sx={{ color: "#eaf2ff" }}>
                  <EmailIcon />
                </IconButton>
                <IconButton component="a" href="/" aria-label="Website" sx={{ color: "#eaf2ff" }}>
                  <PublicIcon />
                </IconButton>
              </Stack>
              <Button
                variant="contained"
                color="primary"
                component="a"
                href="https://github.com/K9TX/CompleteBankSystem"
                target="_blank"
                rel="noopener"
                sx={{ mt: 1, fontWeight: 800, boxShadow: "0 0 16px rgba(45,127,249,0.45)" }}
              >
                Star on GitHub
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutPage;
