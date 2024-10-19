import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { auth } from '../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import GoogleSignIn from './GoogleSignIn'; // Import the Google Sign-In component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import SearchBar from './SearchBar'; // Import the SearchBar component

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Update login state based on user authentication
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Open dropdown menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close dropdown menu
  };

  const handleEventSelect = (category) => {
    // Navigate to the dynamic category page
    navigate(`/events/${category}`);
    handleMenuClose(); // Close the dropdown menu after selection
  };

  const handleHomeClick = () => {
    navigate('/home'); // Navigate to the home page
  };

  const handleSearch = (searchTerm) => {
    const currentPath = window.location.pathname; // Get the current path
    let category = '';

    if (currentPath.includes('/events/')) {
      // If on a category page, extract the category from the URL
      category = currentPath.split('/events/')[1];
    }

    // Build the new URL
    const newUrl = category 
      ? `/events/${category}?search=${encodeURIComponent(searchTerm)}` 
      : `/events?search=${encodeURIComponent(searchTerm)}`; // Default to home page

    navigate(newUrl);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <h1 style={{ flexGrow: 1 }}>My App</h1>

        {/* Home Button */}
        <Button color="inherit" onClick={handleHomeClick}>
          Home
        </Button>

        <Button color="inherit" onClick={handleMenuClick}>
          Select Events
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleEventSelect('concerts')}>Concerts</MenuItem>
          <MenuItem onClick={() => handleEventSelect('sports')}>Sports</MenuItem>
          <MenuItem onClick={() => handleEventSelect('conferences')}>Conferences</MenuItem>
        </Menu>
        {/* SearchBar Component */}
        <SearchBar onSearch={handleSearch}/>

        {!isLoggedIn ? (
          <GoogleSignIn />
        ) : (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
