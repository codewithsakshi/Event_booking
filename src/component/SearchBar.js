import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // Update search term on input change
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    if (searchTerm.trim()) {
      // Call the onSearch function passed as a prop
      await onSearch(searchTerm.trim());
      setSearchTerm(''); // Clear the search input after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        label="Search Events"
        variant="outlined"
        value={searchTerm}
        onChange={handleInputChange}
        style={{ marginRight: '8px' }} // Add some margin to the right
      />
    </form>
  );
};

export default SearchBar;
