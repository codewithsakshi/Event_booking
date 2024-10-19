import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const formatDate = (date) => {
  const eventDate = new Date(date);
  return eventDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Cards = ({ imageUrl, title, date, description, id }) => {
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Function to handle click on card
  const handleCardClick = () => {
    // Navigate to the event detail page with eventId
    navigate(`/event/${id}`);
  };

  return (
    <Card
      key={id}
      onClick={handleCardClick} // Set up click handler for redirection
      sx={{
        transition: "transform 0.3s ease", // Smooth transition for hover effect
        "&:hover": {
          transform: "scale(1.05)", // Slight scaling on hover
          cursor: "pointer", // Change cursor to pointer on hover
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={imageUrl} // Event image
        alt={title} // Event name as alt text
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {title} {/* Event title */}
        </Typography>
        <Typography variant="body2" component="div">
          {description} {/* Event description */}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <EventIcon
            fontSize="small"
            style={{ verticalAlign: "middle", marginRight: "5px" }}
          />
          {formatDate(date)} {/* Using the native date formatting */}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Cards;
