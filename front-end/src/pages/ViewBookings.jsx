import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// .filter(booking => booking.status === 'booked')
// filter(booking => booking.status === 'canceled').

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]); // Initialize bookings as an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/signin"); // Redirect to signin if token is not available
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Ensure that the response data is an array
        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          console.error("Expected an array of bookings, but got:", response.data);
          setBookings([]); // Fallback to empty array if response is not in the expected format
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    
    fetchBookings();
  }, [token]);

  const handleCancelBooking = async (bookingId, showTime) => {
    const cancelTimeLimit = new Date(showTime) - Date.now();
    if (cancelTimeLimit <= 3 * 60 * 60 * 1000) {
      alert("No refund available if canceled within 3 hours of the show.");
    } else {
      try {
        const response = await axios.post("http://localhost:5000/api/bookings/cancel", { bookingId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookings.filter(booking => booking._id !== bookingId)); // Remove canceled booking from state
        alert("Booking canceled successfully.");
      } catch (error) {
        console.error("Error canceling booking:", error);
      }
    }
  };

  return (
    <div className="booking-list text-white">
      <h2>Your Bookings</h2>
      
      <h3>Active Bookings</h3>
      {Array.isArray(bookings) && bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking._id} className="booking-item">
            <h3>{booking.movieName}</h3>
            <p>{`Seats: ${booking.selectedSeats.join(', ')}`}</p>
            <p>{`Showtime: ${new Date(booking.showTime).toLocaleString()}`}</p>
            <button
              className="cancel-btn"
              onClick={() => {
                setSelectedBooking(booking);
                setIsModalOpen(true);
              }}
            >
              Cancel Booking
            </button>
          </div>
        ))
      ) : (
        <p>No active bookings found.</p>
      )}

      <h3>Canceled Bookings</h3>
      {Array.isArray(bookings) && bookings.map((booking) => (
        <div key={booking._id} className="booking-item">
          <h3>{booking.movieName}</h3>
          <p>{`Seats: ${booking.selectedSeats.join(', ')}`}</p>
          <p>{`Showtime: ${new Date(booking.showTime).toLocaleString()}`}</p>
          <p>Status: Canceled</p>
        </div>
      ))}

      {isModalOpen && selectedBooking && (
        <div className="modal">
          <div className="modal-content">
            <h2>Refund Policy</h2>
            <p>
              Are you sure you want to cancel your booking? If canceled, you will receive a 50% refund.
              <br />
              No refund will be provided if canceled within 3 hours of the showtime.
            </p>
            <button
              className="confirm-cancel"
              onClick={() => handleCancelBooking(selectedBooking._id, selectedBooking.showTime)}
            >
              Confirm Cancel
            </button>
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBookings;
