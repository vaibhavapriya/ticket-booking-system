import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/bookings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
      alert("Booking canceled successfully");
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Error canceling booking");
    }
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-center">Manage Your Bookings</h1>
      <div className="mt-8">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id} className="border-b pb-4 mb-4">
              <h2 className="font-semibold">{booking.movieName}</h2>
              <p><strong>Showtime:</strong> {booking.showtime}</p>
              <p><strong>Seats:</strong> {booking.selectedSeats.join(", ")}</p>
              <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
              <button
                onClick={() => navigate(`/booking/${booking._id}`)} // Navigate to booking details for modification
                className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Change Booking
              </button>
              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded ml-4"
              >
                Cancel Booking
              </button>
            </div>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
