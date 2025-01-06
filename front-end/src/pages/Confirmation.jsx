import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { saveAs } from "file-saver";

const Confirmation = () => {
  const { state } = useLocation();
  const { bookingData } = state || {};
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    if (!bookingData) {
      console.error("No booking data found.");
    }
  }, [bookingData]);

  // Function to download booking confirmation as PDF
  const downloadPdf = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://ticket-booking-system-7vpl.onrender.com/api/bookings/generate-pdf", // Your API endpoint to generate PDF
        bookingData,
        { responseType: "blob" }
      );
      const pdfBlob = response.data;
      saveAs(pdfBlob, `Booking_${bookingData.orderId}.pdf`);
      setLoading(false);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setLoading(false);
    }
  };

  // Function to navigate back to the home page
  const handleGoBack = () => {
    navigate("/"); // This will navigate to the home page
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-white">
        <p className="text-xl font-semibold">No booking data available.</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center px-6 py-10">
        <h1 className="text-3xl font-bold text-[#db0a5b] mb-6">Booking Confirmation</h1>
        <div className="bg-[#2d2d2d] rounded-lg shadow-lg w-full max-w-3xl p-6">
          <p className="text-lg">
            <strong>Movie Name:</strong> {bookingData.movieName}
          </p>
          <p className="text-lg mt-2">
            <strong>Theater:</strong> {bookingData.theaterName}
          </p>
          <p className="text-lg mt-2">
            <strong>Showtime:</strong> {bookingData.screenName}
          </p>
          <p className="text-lg mt-2">
            <strong>Seats:</strong> {bookingData.selectedSeats.join(", ")}
          </p>
          <p className="text-lg mt-2">
            <strong>Total Price:</strong> ₹{bookingData.totalPrice}
          </p>
          <p className="text-lg mt-2">
            <strong>Order ID:</strong> {bookingData.orderId}
          </p>
          <p className="text-lg mt-2">
            <strong>Email:</strong> {bookingData.email}
          </p>
          <p className="text-lg mt-2">
            <strong>Phone:</strong> {bookingData.phoneNumber}
          </p>
        </div>

        <button
          onClick={downloadPdf}
          className={`mt-8 bg-[#db0a5b] text-white px-6 py-3 rounded-lg hover:bg-[#f62459] transition ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
          disabled={loading}
        >
          {loading ? "Generating PDF..." : "Download PDF"}
        </button>

        {/* Go back button */}
        <button
          onClick={handleGoBack}
          className="mt-4 bg-[#f1f1f1] text-[#db0a5b] px-6 py-3 rounded-lg hover:bg-[#e0e0e0] transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Confirmation;

