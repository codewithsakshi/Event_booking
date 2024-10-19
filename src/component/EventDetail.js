import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import SeatSelectionModal from "./SeatSelectionModal"; // Import the modal component
import LoginModal from "./LoginModal"; // Import the login modal component
import { auth } from "../firebaseConfig"; // Import Firebase Auth config

const EventDetail = ({ imageUrl }) => {
  const { eventId } = useParams(); // Get eventId from the URL
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); // State to handle modal open/close
  const [loginModalOpen, setLoginModalOpen] = useState(false); // State for login modal
  const [loginMessage, setLoginMessage] = useState(""); // State to manage login messages

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`https://6713ce9e690bf212c75fd70c.mockapi.io/events/${eventId}`);
        const data = await response.json();
        setEventData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleBookNow = () => {
    if (!auth.currentUser) {
      setLoginModalOpen(true); // Show login modal if not logged in
    } else {
      setModalOpen(true); // Open seat selection modal if logged in
    }
  };

  const handleLoginSuccess = () => {
    setLoginMessage("Login is successful! You can book tickets now."); // Set login success message
    setTimeout(() => setLoginMessage(""), 3000); // Clear message after 3 seconds
    setModalOpen(true); // Open seat selection modal
  };

  if (loading) {
    return <Typography>Loading...</Typography>; // Simple loading text
  }

  if (!eventData) {
    return <Typography>No event found</Typography>; // Handle case where no event data is available
  }

  return (
    <Container sx={{ position: "relative", padding: "20px", height: "100vh", color: "white" }}>
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(3px)",
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background for readability
          borderRadius: "8px",
          maxWidth: "800px",
          margin: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Side: Image */}
        <img src={eventData.imageUrl} alt={eventData.title} style={{ width: "200px", borderRadius: "8px", marginRight: "20px" }} />
        
        {/* Right Side: Title, Description, Date, and Button */}
        <Box>
          <Typography variant="h4">{eventData.title}</Typography>
          <Typography variant="body1" sx={{ marginY: "10px" }}>
            {eventData.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {new Date(eventData.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ marginTop: "10px" }} 
            onClick={handleBookNow} // Open modal on button click
          >
            Book Now
          </Button>
        </Box>
      </Box>

      {/* Modal for Seat Selection */}
      <SeatSelectionModal open={modalOpen} handleClose={() => setModalOpen(false)} priceTiers={eventData.priceTiers} />
      
      {/* Modal for Login */}
      <LoginModal open={loginModalOpen} handleClose={() => setLoginModalOpen(false)} handleLoginSuccess={handleLoginSuccess} />
    </Container>
  );
};

export default EventDetail;
