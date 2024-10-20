import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Grid } from '@mui/material';
import Cards from './Cards';

const NoEventsAvailable = () => (
  <Typography variant="h6" style={{ textAlign: 'center', marginTop: '20px' }}>
    No events available for this category.
  </Typography>
);

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryParams = new URLSearchParams(useLocation().search);
  const searchQuery = queryParams.get('search');
  const category = useLocation().pathname.split('/events/')[1];

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

        const categoryVal = JSON.parse(localStorage.getItem("categoryVal"));
        if (categoryVal) {
          const updatedResult = filteredResults.filter(event => {
            return (event.category === categoryVal || categoryVal === "home");
          });
          console.log({ updatedResult });
          setResults(updatedResult);
        } else {
          setResults(filteredResults);
        }
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
    <Grid container spacing={2} style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px"}}>
      {results.length === 0 ? (
        <NoEventsAvailable />
      ) : (
        results.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Cards
              imageUrl={event.imageUrl} 
              title={event.title}      
              date={event.date} 
              description={event.description} 
              id={event.id}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default SearchResults;
