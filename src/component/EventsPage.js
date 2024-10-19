import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Grid, Typography, CircularProgress } from '@mui/material';
import Cards from './Cards'; // Import the Cards component

const EventsPage = () => {
  const { category } = useParams(); // Get the category from the URL if available
  const location = useLocation(); // Get the current location
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let apiUrl = 'https://6713ce9e690bf212c75fd70c.mockapi.io/events'; // Base API URL
        
        // Check if there is a search query in the URL
        const searchParams = new URLSearchParams(location.search);
        const searchTerm = searchParams.get('search');
        
        // If a search term exists, append it to the API URL
        if (searchTerm) {
          apiUrl += `?search=${searchTerm}`;
        } else if (category) {
          // If a category is provided, fetch events based on the category
          apiUrl += `?category=${category}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [category, location.search]); // Re-fetch when the category or search query changes

  if (loading) {
    return <CircularProgress />; // Show a loader while data is being fetched
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {category ? `Events for ${category}` : 'All Events'} {location.search && ` - Search Results for "${new URLSearchParams(location.search).get('search')}"`}
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Cards 
              imageUrl={event.imageUrl}   // Pass the image URL to the Cards component
              title={event.title}           // Pass the event name
              date={event.date} 
              description={event.description}           // Pass the event date
              id={event.id}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EventsPage;
