import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Grid, Typography, CircularProgress, FormControl, Select, MenuItem } from '@mui/material';
import Cards from './Cards';

const EventsPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('');
  
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

        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [category, location.pathname]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value); 
  };

  const sortedEvents = () => {
    if (sortOrder === 'lowToHigh') {
      return [...events].sort((a, b) => {
        const standardPriceA = a.priceTiers?.find(tier => tier.tier === "Standard")?.price || Infinity;
        const standardPriceB = b.priceTiers?.find(tier => tier.tier === "Standard")?.price || Infinity;
        return standardPriceA - standardPriceB;
      });
    }
    if (sortOrder === 'highToLow') {
      return [...events].sort((a, b) => {
        const standardPriceA = a.priceTiers?.find(tier => tier.tier === "Standard")?.price || -Infinity;
        const standardPriceB = b.priceTiers?.find(tier => tier.tier === "Standard")?.price || -Infinity;
        return standardPriceB - standardPriceA;
      });
    }
    return events; 
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress size={80} />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', margin: "20px 70px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" style={{ textAlign: 'center', flexGrow: 1 }}>
          Book our upcoming events
        </Typography>

        <FormControl variant="outlined" style={{ width: '200px' }}>
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Sort By' }}
            sx={{ height: '40px' }} 
          >
            <MenuItem value="">
              <em>Sort By Price</em>
            </MenuItem>
            <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
            <MenuItem value="highToLow">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Grid container spacing={3}>
        {sortedEvents().map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Cards 
              imageUrl={event.imageUrl} 
              title={event.title} 
              date={event.date} 
              description={event.description}
              id={event.id}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EventsPage;
