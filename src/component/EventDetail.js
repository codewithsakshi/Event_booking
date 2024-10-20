import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import SeatSelectionModal from "./SeatSelectionModal";
import LoginModal from "./LoginModal";
import { auth } from "../firebaseConfig";

const EventDetail = ({ imageUrl }) => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false); 
  const [loginMessage, setLoginMessage] = useState(""); 

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
      setLoginModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setLoginMessage("Login is successful! You can book tickets now.");
    setTimeout(() => setLoginMessage(""), 3000);
    setModalOpen(true);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!eventData) {
    return <Typography>No event found</Typography>;
  }

  return (
    <Container sx={{ position: "relative", padding: "20px", height: "100vh", color: "white" }}>
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
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "8px",
          maxWidth: "800px",
          margin: "auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <img src={eventData.imageUrl} alt={eventData.title} style={{ width: "200px", borderRadius: "8px", marginRight: "20px" }} />
        
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
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        </Box>
      </Box>

      <SeatSelectionModal open={modalOpen} handleClose={() => setModalOpen(false)} priceTiers={eventData.priceTiers} eventDetails={eventData}/>
      <LoginModal open={loginModalOpen} handleClose={() => setLoginModalOpen(false)} handleLoginSuccess={handleLoginSuccess} />
    </Container>
  );
};

export default EventDetail;
