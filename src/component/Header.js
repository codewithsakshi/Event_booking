import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';
import { auth } from '../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import GoogleSignIn from './GoogleSignIn'; 
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar'; 

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); 
    });

    return () => unsubscribe(); 
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEventSelect = (category) => {
    navigate(`/events/${category}`);
    handleMenuClose();
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleSearch = (searchTerm) => {
    const currentPath = window.location.pathname;
    let category = '';

    if (currentPath.includes('/events/')) {
      category = currentPath.split('/events/')[1];
    }

    const newUrl = `/events?search=${encodeURIComponent(searchTerm)}`;

    navigate(newUrl);
  };

  const handleMouseEnter = (event) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout); // Clear any existing timeout
    }
    setAnchorEl(event.currentTarget); // Open menu
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setAnchorEl(null); // Close menu after a delay
    }, 5000); // Delay in milliseconds
    setHoverTimeout(timeout); // Save the timeout
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        color: "black",
        height: "65px",
        padding: "0 70px", // Add 70px padding to the left and right
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "12px",
            textTransform: "capitalize",
          }}
        >
          <h1
            style={{
              marginRight: "20px",
              fontSize: "18px",
              textTransform: "capitalize",
            }}
          >
            Event Booking
          </h1>
          <Button
            color="inherit"
            onClick={handleHomeClick}
            sx={{ fontSize: "14px", textTransform: "capitalize" }}
          >
            Home
          </Button>
        </div>

        {/* Centered Search Bar */}
        <SearchBar onSearch={handleSearch} sx={{ flexGrow: 1 }} />

        <div style={{ display: "flex", gap: "10px" }}>
          {" "}
          {/* Add 10px space between buttons */}
          <Button
            color="inherit"
            onClick={handleMenuClick}
            sx={{
              fontSize: "14px",
              textTransform: "capitalize",
              cursor: "pointer",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Select Events
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => handleEventSelect("concerts")}
              sx={{ fontSize: "14px", textTransform: "capitalize" }}
            >
              Concerts
            </MenuItem>
            <MenuItem
              onClick={() => handleEventSelect("sports")}
              sx={{ fontSize: "14px", textTransform: "capitalize" }}
            >
              Sports
            </MenuItem>
            <MenuItem
              onClick={() => handleEventSelect("conferences")}
              sx={{ fontSize: "14px", textTransform: "capitalize" }}
            >
              Conferences
            </MenuItem>
          </Menu>
          {!isLoggedIn ? (
            <GoogleSignIn />
          ) : (
            <Button
              color="primary"
              variant="contained"
              onClick={handleLogout}
              sx={{ fontSize: "12px", textTransform: "capitalize" }}
            >
              Logout
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
