import React, { useState } from "react";
import { Modal, Box, Typography, Grid, Button, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { getAuth } from "firebase/auth";

const SeatSelectionModal = ({ open, handleClose, priceTiers, eventDetails }) => {
  const [selectedSeats, setSelectedSeats] = useState({
    Economy: 0,
    Standard: 0,
    VIP: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [bookingDone, setBookingDone] = useState(false);

  const handleSeatChange = (tier, change) => {
    setSelectedSeats((prev) => ({
      ...prev,
      [tier]: Math.max(0, prev[tier] + change), 
    }));
  };

  // Calculate total selected seats and total price
  const totalSeats = Object.values(selectedSeats).reduce((acc, count) => acc + count, 0);
  const totalPrice = priceTiers.reduce((acc, { tier, price }) => acc + selectedSeats[tier] * price, 0);

  // Calculate discount if applicable
  let discountedPrice = totalPrice;
  let discount = 0;

  if (totalSeats > 3) {
    discount = 0.1; // 10% discount
    discountedPrice = totalPrice * (1 - discount);
  }

  const handleBookSeats = async () => {
    const auth = getAuth();
    const currentUserId = auth.currentUser ? auth.currentUser.email : null;
  
    if (!currentUserId) {
      setSnackbar({
        open: true,
        message: "Please log in to make a booking.",
        severity: "error",
      });
      return;
    }
  
    try {
      const eventsResponse = await fetch('https://6713ce9e690bf212c75fd70c.mockapi.io/events');
      const allEvents = await eventsResponse.json();
  
      // Calculate total tickets booked by the user across all events
      let totalBookedTickets = 0;
  
      allEvents.forEach((event) => {
        const userBooking = event.bookings.find((booking) => booking.userId === currentUserId);
        if (userBooking) {
          totalBookedTickets += userBooking.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
        }
      });
  
      const currentBookingTickets = Object.values(selectedSeats).reduce((acc, count) => acc + count, 0);

    if (currentBookingTickets === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one seat to book.",
        severity: "error",
      });
      return; // Exit without proceeding with the booking
    }
  
      if (totalBookedTickets + currentBookingTickets > 10) {
        setSnackbar({
          open: true,
          message: `You can only book up to 10 tickets in total. You have already booked ${totalBookedTickets}.`,
          severity: "error",
        });
        return;
      }
  
      if (currentBookingTickets > 5) {
        setSnackbar({
          open: true,
          message: "Only 5 seats can be selected at a time",
          severity: "error",
        });
        return;
      }
  
      const response = await fetch(`https://6713ce9e690bf212c75fd70c.mockapi.io/events/${eventDetails.id}`);
      const eventData = await response.json();
  
      // Adjust prices based on seat availability
      const updatedPriceTiers = eventData.priceTiers.map(tier => {
        const bookedSeats = tier.totalSeats - tier.availableSeats;
        const bookingPercentage = (bookedSeats / tier.totalSeats) * 100;
  
        // Calculate price increase based on booked percentage
        const priceIncreaseFactor = Math.floor(bookingPercentage / 10) * 0.1;
        const adjustedPrice = tier.price * (1 + priceIncreaseFactor);
  
        return {
          ...tier,
          price: adjustedPrice.toFixed(2),
        };
      });
  
      const newTickets = Object.keys(selectedSeats)
        .filter((tier) => selectedSeats[tier] > 0)
        .map((tier) => ({
          priceTier: tier,
          quantity: selectedSeats[tier],
        }));
  
      const existingBookingIndex = eventData.bookings.findIndex(
        (booking) => booking.userId === currentUserId
      );
  
      if (existingBookingIndex !== -1) {
        const existingBooking = eventData.bookings[existingBookingIndex];
  
        newTickets.forEach((newTicket) => {
          const existingTicketIndex = existingBooking.tickets.findIndex(
            (ticket) => ticket.priceTier === newTicket.priceTier
          );
  
          if (existingTicketIndex !== -1) {
            existingBooking.tickets[existingTicketIndex].quantity += newTicket.quantity;
          } else {
            existingBooking.tickets.push(newTicket);
          }
        });
  
        eventData.bookings[existingBookingIndex] = existingBooking;
      } else {
        const newBooking = {
          userId: currentUserId,
          tickets: newTickets,
        };
        eventData.bookings.push(newBooking);
      }
  
      updatedPriceTiers.forEach(tier => {
        const ticket = newTickets.find(t => t.priceTier === tier.tier);
        if (ticket) {
          tier.availableSeats = Math.max(0, tier.availableSeats - ticket.quantity); // Prevent negative seats
        }
      });
  
      eventData.priceTiers = updatedPriceTiers;
  
      await fetch(`https://6713ce9e690bf212c75fd70c.mockapi.io/events/${eventDetails.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
  
      setSnackbar({
        open: true,
        message: "Your booking has been successfully made",
        severity: "success",
      });
      setBookingDone(true);
  
      setTimeout(() => {
        handleClose();
        window.location.reload();
      }, 5000);
    } catch (error) {
      console.error("Error updating booking:", error);
      setSnackbar({
        open: true,
        message: "Error while booking, please try again",
        severity: "error",
      });
    }
  };
  
  
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          bgcolor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: 400,
          margin: "auto",
          marginTop: "100px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Select Seat Type
        </Typography>
        <Grid container spacing={2}>
          {priceTiers.map(({ tier, price }) => (
            <Grid
              item
              xs={12}
              key={tier}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography sx={{ flexGrow: 1 }}>
                {tier} (Rs{price}) -
              </Typography>
              <Button onClick={() => handleSeatChange(tier, -1)}>-</Button>
              <Typography sx={{ marginX: 1 }}>{selectedSeats[tier]}</Typography>
              <Button onClick={() => handleSeatChange(tier, 1)}>+</Button>
            </Grid>
          ))}
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #ccc",
            paddingTop: "10px",
          }}
        >
          <Typography variant="body1">Selected Seats: {totalSeats}</Typography>
          {totalSeats > 3 ? (
            <>
              <Typography variant="body1" sx={{ textDecoration: 'line-through', color: 'red' }}>
                Rs {totalPrice.toFixed(2)}
              </Typography>
              <Typography variant="body1"> Rs.{discountedPrice.toFixed(2)}</Typography>
            </>
          ) : (
            <Typography variant="body1">Subtotal: Rs.{totalPrice.toFixed(2)}</Typography>
          )}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleBookSeats}
          sx={{ marginTop: "20px" }}
        >
          Confirm Booking
        </Button>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000} 
          onClose={handleSnackbarClose}
          message={snackbar.message}
          severity={snackbar.severity} 
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
          action={
            <Button color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon />
            </Button>
          }
          ContentProps={{
            sx: {
              bgcolor: snackbar.severity === "error" ? "red" : "green",
            },
          }}
        />
      </Box>
    </Modal>
  );
};

export default SeatSelectionModal;
