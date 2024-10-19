import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   const handleSearchSubmit = async (event) => {
//     event.preventDefault(); // Prevent default form submission behavior

//     // Navigate to the search results page
//     navigate(`/events?search=${encodeURIComponent(searchTerm)}`);
//   };

  return (
    <form >
      {/* <TextField
        variant="outlined"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginRight: '10px' }} // Add margin for spacing
      />
      <Button type="submit" variant="contained" color="primary">
        Search */}
      {/* </Button> */}
    </form>
  );
};

export default SearchBar;
