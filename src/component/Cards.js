import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { useNavigate } from "react-router-dom";

const formatDate = (date) => {
  const eventDate = new Date(date);
  return eventDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Cards = ({ imageUrl, title, date, description, id }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/event/${id}`);
  };

  return (
    <Card
      key={id}
      onClick={handleCardClick}
      sx={{
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)", 
          cursor: "pointer", 
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={title}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" component="div">
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <EventIcon
            fontSize="small"
            style={{ verticalAlign: "middle", marginRight: "5px" }}
          />
          {formatDate(date)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Cards;
