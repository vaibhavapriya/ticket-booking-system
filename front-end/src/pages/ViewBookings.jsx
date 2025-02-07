import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/signin");
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("https://ticket-booking-system-7vpl.onrender.com/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          console.error("Expected an array of bookings, but got:", response.data);
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
        await axios.post(
          "https://ticket-booking-system-7vpl.onrender.com/api/bookings/cancel",
          { bookingId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(bookings.filter((booking) => booking._id !== bookingId));
        alert("Booking canceled successfully.");
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error canceling booking:", error);
      }
    }
  };

  const activeBookings = bookings.filter((booking) => booking.status === "booked");
  const canceledBookings = bookings.filter((booking) => booking.status === "canceled");

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <Header />
      <h2 className="text-3xl font-bold text-[#db0a5b] mb-6 mt-10">Your Bookings</h2>

      <div>
        <h3 className="text-2xl font-semibold text-[#f62459] mb-4">Active Bookings</h3>
        {activeBookings.length > 0 ? (
          activeBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-[#2d2d2d] rounded-lg shadow-lg p-4 mb-4"
            >
              <h3 className="text-lg font-bold">{booking.movieName}</h3>
              <p>Seats: {booking.selectedSeats.join(", ")}</p>
              <p>Showtime: {new Date(booking.showTime).toLocaleString()}</p>
              <button
                className="bg-[#db0a5b] text-white px-4 py-2 mt-3 rounded hover:bg-[#f62459] transition"
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
          <p className="text-gray-400">No active bookings found.</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-[#f62459] mb-4">Canceled Bookings</h3>
        {canceledBookings.length > 0 ? (
          canceledBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-[#2d2d2d] rounded-lg shadow-lg p-4 mb-4"
            >
              <h3 className="text-lg font-bold">{booking.movieName}</h3>
              <p>Seats: {booking.selectedSeats.join(", ")}</p>
              <p>Showtime: {new Date(booking.showTime).toLocaleString()}</p>
              <p className="text-red-500 font-semibold">Status: Canceled</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No canceled bookings found.</p>
        )}
      </div>

      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#2d2d2d] rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#f62459] mb-4">Refund Policy</h2>
            <p className="text-gray-300">
              Are you sure you want to cancel your booking? If canceled, you will
              receive a 50% refund. No refund will be provided if canceled within
              3 hours of the showtime.
            </p>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                className="bg-[#db0a5b] text-white px-4 py-2 rounded hover:bg-[#f62459] transition"
                onClick={() =>
                  handleCancelBooking(selectedBooking._id, selectedBooking.showTime)
                }
              >
                Confirm Cancel
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBookings;
