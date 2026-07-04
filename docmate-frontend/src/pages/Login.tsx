import { useState, useEffect } from "react";
import api from "../services/api";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Stack
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import SecurityIcon from "@mui/icons-material/Security";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

function Login() {

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [maskedEmail, setMaskedEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [countdown, setCountdown] = useState(30);

  const [canResend, setCanResend] = useState(false);

  useEffect(() => {

    if (!otpSent || canResend) {

      return;

    }

    const timer = setInterval(() => {

      setCountdown((prev) => {

        if (prev <= 1) {

          clearInterval(timer);

          setCanResend(true);

          return 0;

        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [otpSent, canResend]);

  const maskEmail = (email: string) => {

    const parts = email.split("@");

    if (parts.length !== 2) {

      return email;

    }

    const name = parts[0];
    const domain = parts[1];

    return (
      name.substring(0, 3) +
      "****@" +
      domain
    );

  };

  const sendOtp = async () => {

    if (!email.includes("@")) {

      setErrorMessage("Please enter a valid email.");

      return;

    }

    try {

      setLoading(true);

      await api.post(
        "/auth/send-otp",
        {
          email
        }
      );

      setOtpSent(true);
      setMaskedEmail(maskEmail(email));

      setCountdown(30);
      setCanResend(false);

      setSuccessMessage("OTP sent successfully.");

    } catch (error) {

      console.error(error);

      setErrorMessage("Failed to send OTP.");

    } finally {

      setLoading(false);

    }

  };

  const verifyOtp = async () => {

    if (!otp) {

      setErrorMessage("Please enter OTP.");

      return;

    }

    try {

      setLoading(true);

      const response = await api.post(
        "/auth/verify-otp",
        {
          email,
          otp
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "email",
        email
      );

      setSuccessMessage("Login Successful");

      setTimeout(() => {

        window.location.href = "/dashboard";

      }, 800);

    } catch (error) {

      console.error(error);

      setErrorMessage("Invalid OTP.");

    } finally {

      setLoading(false);

    }

  };

  const resendOtp = async () => {

    try {

      await sendOtp();

      setOtp("");

      setCountdown(30);

      setCanResend(false);

      setSuccessMessage("A new OTP has been sent.");

    } catch (error) {

      console.error(error);

      setErrorMessage("Failed to send OTP.");

    }

  };


  return (

    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#f5f7fb"
      }}
    >

      {/* Left Panel */}

      <Box
        sx={{
          width: {
            xs: "0%",
            md: "45%"
          },
          display: {
            xs: "none",
            md: "flex"
          },
          flexDirection: "column",
          justifyContent: "center",
          p: 6,
          color: "white",
          background:
            "linear-gradient(135deg,#1976d2,#1565c0,#0d47a1)"
        }}
      >

        <DescriptionIcon
          sx={{
            fontSize: 70,
            mb: 3
          }}
        />

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2
          }}
        >
          DocMate
        </Typography>

        <Typography
          sx={{
            opacity: 0.9,
            mb: 5,
            fontSize: 18
          }}
        >
          Secure AI Powered Document Management System
        </Typography>

        <Stack spacing={3}>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center"
            }}
          >

            <AutoAwesomeIcon />

            <Typography>

              AI OCR Extraction

            </Typography>

          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center"
            }}
          >

            <SecurityIcon />

            <Typography>

              Secure OTP Authentication

            </Typography>

          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center"
            }}
          >

            <NotificationsActiveIcon />

            <Typography>

              Smart Expiry Reminders

            </Typography>

          </Box>

        </Stack>

      </Box>

      {/* Right Panel */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3
        }}
      >

        <Paper
          elevation={5}
          sx={{
            width: 400,
            borderRadius: 4,
            p: 5
          }}
        >

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              textAlign: "center"
            }}
          >
            Welcome Back 👋
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              textAlign: "center",
              mb: 4
            }}
          >
            Sign in to continue using DocMate
          </Typography>

          {
            !otpSent && (

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
              />

            )
          }
          {

            !otpSent ?

              (

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  onClick={sendOtp}
                >

                  {

                    loading

                      ?

                      <CircularProgress
                        size={24}
                        color="inherit"
                      />

                      :

                      "Send OTP"

                  }

                </Button>

              )

              :

              (

                <>

                  <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                  >

                    OTP sent successfully!

                    <br />

                    <strong>

                      {maskedEmail}

                    </strong>

                  </Alert>

                  <TextField
                    fullWidth
                    label="Enter OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value)
                    }
                    sx={{ mb: 3 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    onClick={verifyOtp}
                  >

                    {

                      loading

                        ?

                        <CircularProgress
                          size={24}
                          color="inherit"
                        />

                        :

                        "Verify OTP"

                    }

                  </Button>

                  <Box
                    sx={{
                      mt: 2,
                      textAlign: "center"
                    }}
                  >
                    {
                      canResend ? (

                        <Button
                          variant="text"
                          onClick={resendOtp}
                        >
                          Resend OTP
                        </Button>

                      ) : (

                        <Typography
                          color="text.secondary"
                          variant="body2"
                        >
                          Resend OTP in {countdown}s
                        </Typography>

                      )
                    }
                  </Box>

                  <Button
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {

                      setOtpSent(false);
                      setOtp("");
                      setCountdown(30);
                      setCanResend(false);
                      setMaskedEmail("");

                    }}
                  >

                    ← Change Email

                  </Button>

                </>

              )

          }

        </Paper>

      </Box>

      <Snackbar
        open={successMessage.length > 0}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
      >

        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage("")}
        >

          {successMessage}

        </Alert>

      </Snackbar>

      <Snackbar
        open={errorMessage.length > 0}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
      >

        <Alert
          severity="error"
          variant="filled"
          onClose={() => setErrorMessage("")}
        >

          {errorMessage}

        </Alert>

      </Snackbar>

    </Box>

  );

}

export default Login;