import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      await onSearch(searchTerm.trim());
      setSearchTerm('');
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
          e.target.style.border = '1px solid #ccc';
        }}
        onBlur={(e) => {
          e.target.style.border = '1px solid #ccc';
        }}
      />
    </form>
  );
};

export default SearchBar;
