import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Grid, Typography, CircularProgress, FormControl, Select, MenuItem } from '@mui/material';
import Cards from './Cards'; // Import the Cards component

const EventsPage = () => {
  const { category } = useParams(); // Get the category from the URL if available
  const location = useLocation(); // Get the current location
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState(''); // State for sorting
  
  const categoryVal = location.pathname === '/home' ? "home" : category;
  localStorage.setItem("categoryVal", JSON.stringify(categoryVal));
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl = location.pathname === '/home' 
          ? 'https://6713ce9e690bf212c75fd70c.mockapi.io/events' 
          : `https://6713ce9e690bf212c75fd70c.mockapi.io/events?category=${category}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Store the fetched events in state
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [category, location.pathname]); // Re-fetch when the category or route changes

  // Function to sort events based on selected order
  const handleSortChange = (event) => {
    setSortOrder(event.target.value); // Set selected sort order
  };

  // Sort events based on selected order
  const sortedEvents = () => {
    if (sortOrder === 'lowToHigh') {
      return [...events].sort((a, b) => {
        const standardPriceA = a.priceTiers?.find(tier => tier.tier === "Standard")?.price || Infinity;
        const standardPriceB = b.priceTiers?.find(tier => tier.tier === "Standard")?.price || Infinity;
        return standardPriceA - standardPriceB; // Sort in ascending order
      });
    }
    if (sortOrder === 'highToLow') {
      return [...events].sort((a, b) => {
        const standardPriceA = a.priceTiers?.find(tier => tier.tier === "Standard")?.price || -Infinity;
        const standardPriceB = b.priceTiers?.find(tier => tier.tier === "Standard")?.price || -Infinity;
        return standardPriceB - standardPriceA; // Sort in descending order
      });
    }
    return events; // Return unsorted events if no order is selected
  };

  if (loading) {
    return <CircularProgress />; // Show a loader while data is being fetched
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {location.pathname === '/home' ? 'All Events' : `Events for ${category}`}
      </Typography>

      {/* Price Range Dropdown */}
      <FormControl variant="outlined" style={{ marginBottom: '20px', float: 'right' }}>
        <Select
          value={sortOrder}
          onChange={handleSortChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Sort By' }}
        >
          <MenuItem value="">
            <em>Sort By Price</em>
          </MenuItem>
          <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
          <MenuItem value="highToLow">Price: High to Low</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        {sortedEvents().map((event) => (
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
