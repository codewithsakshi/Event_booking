import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './component/Header';
import EventsPage from './component/EventsPage';
import EventDetail from './component/EventDetail'
import SearchResults from './component/SearchResults'; // Import the SearchResults component


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<EventsPage />} />
        <Route path="/events/:category" element={<EventsPage />} />
        <Route path="/event/:eventId" element={<EventDetail imageUrl="https://path.to/your/default/hero/image.jpg" />} />
        <Route path="/events" element={<SearchResults />} /> {/* Route for search results */}
      </Routes>
    </Router>
  );
};

export default App;
