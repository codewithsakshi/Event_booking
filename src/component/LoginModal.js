import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import {auth} from '../firebaseConfig'
import GoogleSignIn from './GoogleSignIn'; // Import the Google Sign-In component
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';


const LoginModal = ({ open, handleClose, handleLoginSuccess }) => {
  const provider = new GoogleAuthProvider();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
    //   await auth.signInWithPopup(GoogleSignIn);
      handleLoginSuccess(); // Call the success function after login
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          bgcolor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: 400,
          margin: "auto",
          marginTop: "100px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Please log in to book tickets
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGoogleLogin}>
          Login with Google
        </Button>
      </Box>
    </Modal>
  );
};

export default LoginModal;
