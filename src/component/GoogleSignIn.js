import React from 'react';
import { auth } from '../firebaseConfig'; // Ensure this points to your Firebase configuration
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@mui/material';

const GoogleSignIn = () => {
  const provider = new GoogleAuthProvider();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in:', user);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleSignIn}>
      Sign in
    </Button>
  );
};

export default GoogleSignIn;
