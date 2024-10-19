import React, { useState } from "react";
import { Modal, Box, Typography, Grid, Button, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // Import the Close icon

const SeatSelectionModal = ({ open, handleClose, priceTiers }) => {
  const [selectedSeats, setSelectedSeats] = useState({
    Economy: 0,
    Standard: 0,
    VIP: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // or "error"
  });
  const [bookingDone, setBookingDone] = useState(false); // Track booking status

  const handleSeatChange = (tier, change) => {
    setSelectedSeats((prev) => ({
      ...prev,
      [tier]: Math.max(0, prev[tier] + change), // Prevent negative seat selection
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

  const handleBookSeats = () => {
    if (totalSeats > 5) {
      // Show error snackbar if more than 5 seats are selected
      setSnackbar({
        open: true,
        message: "Only 5 seats can be selected at a time",
        severity: "error",
      });
    } else if (!bookingDone) { // Only show success snackbar if booking is not done
      // Logic for booking seats
      console.log("Booking seats:", selectedSeats);
      setSnackbar({
        open: true,
        message: "Your booking has been successfully",
        severity: "success",
      });
      setBookingDone(true); // Mark booking as done
      // Delay closing the modal until after the Snackbar is shown
      setTimeout(() => {
        handleClose(); // Close the modal after successful booking
      }, 5000); // Close modal after 5 seconds (or match with Snackbar duration)
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

        {/* Display selected seats and total price */}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #ccc", // Add top border
            paddingTop: "10px", // Optional: padding for better spacing
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

        {/* Snackbar for feedback messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000} // Auto hide after 5 seconds
          onClose={handleSnackbarClose}
          message={snackbar.message}
          severity={snackbar.severity} // Use the appropriate severity
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position of Snackbar
          action={
            <Button color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon />
            </Button>
          }
          ContentProps={{
            sx: {
              bgcolor: snackbar.severity === "error" ? "red" : "green", // Change background color based on severity
            },
          }}
        />
      </Box>
    </Modal>
  );
};

export default SeatSelectionModal;
