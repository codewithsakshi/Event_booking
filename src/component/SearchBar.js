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
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search Events"
        style={{
          width: '300px',      
          height: '25px',      
          padding: '5px 20px',       
          fontSize: '14px',     
          borderRadius: '4px',  
          border: '1px solid #ccc',
          marginRight: '8px'   
        }}
        onFocus={(e) => {
          e.target.style.outline = 'none';
          e.target.style.border = '1px solid #ccc'; // Keep the same border
        }}
        onBlur={(e) => {
          e.target.style.border = '1px solid #ccc'; // Ensure border remains unchanged
        }}
      />
    </form>
  );
};

export default SearchBar;
