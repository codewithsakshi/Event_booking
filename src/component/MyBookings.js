import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const MyBookings = () => {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.email : null;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('https://6713ce9e690bf212c75fd70c.mockapi.io/events');
        const allEvents = await response.json();

        // Filter bookings based on the authenticated user's email
        const filteredBookings = allEvents
          .map(event => {
            const userBooking = event.bookings.find(booking => booking.userId === currentUserId);
            return userBooking ? { ...event, userBooking } : null;
          })
          .filter(event => event !== null); // Remove null entries

        setMyBookings(filteredBookings);
      } catch (error) {
        setError('Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUserId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <div>
      {myBookings.length === 0 ? (
        <Typography style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          No bookings found.
        </Typography>
      ) : (
        <List style={{padding: "20px 70px", width: "700px"}}>
          {myBookings.map(event => {
            const eventDate = new Date(event.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <ListItem key={event.id} style={{ borderBottom: '1px solid #ddd', padding: '16px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={event.imageUrl} // Extract the image from event data
                    alt={event.title}
                    style={{ width: '100px', height: '100px', marginRight: '16px', borderRadius: '2px', objectFit: 'cover' }} // Style the image
                  />
                  <ListItemText style={{width: "300px"}}
                    primary={event.title}
                    secondary={`${eventDate} - Tickets: ${event.userBooking.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0)}`}
                  />
                </div>
                <ul style={{width: "200px"}}>
                  {event.userBooking.tickets.map((ticket, index) => (
                    <li key={index}>
                      {ticket.quantity} x {ticket.priceTier}
                    </li>
                  ))}
                </ul>
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
};

export default MyBookings;
