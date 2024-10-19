import Cards from './Cards'; // Import the Cards component

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Grid, Card, CardContent } from '@mui/material';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryParams = new URLSearchParams(useLocation().search);
  const searchQuery = queryParams.get('search'); // Get the search query from URL
  const category = useLocation().pathname.split('/events/')[1]; // Get the category from the URL

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`https://6713ce9e690bf212c75fd70c.mockapi.io/events`);
        const data = await response.json();

        // Filter results based on the category and search query
        const filteredResults = data.filter(event => {
          const matchesCategory = category ? event.category === category : true;
          const matchesSearch = searchQuery ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;

          return matchesCategory && matchesSearch;
        });

        setResults(filteredResults);
      } catch (error) {
        setError('Error fetching search results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery, category]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {results.map(event => (
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
  );
};

export default SearchResults;
