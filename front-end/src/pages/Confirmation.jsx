import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
// import { saveAs } from "file-saver";

const Confirmation = () => {
  const { state } = useLocation();
  const { bookingData } = state;
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Additional logic can be added here if required
  }, []);

  // Function to download booking confirmation as PDF
  const downloadPdf = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/booking/generate-pdf", // Your API endpoint to generate PDF
        bookingData,
        { responseType: 'blob' }
      );
      const pdfBlob = response.data;
      saveAs(pdfBlob, `Booking_${bookingData.orderId}.pdf`);
      setLoading(false);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-center">Booking Confirmation</h1>
      <div className="mt-8">
        <p><strong>Movie Name:</strong> {bookingData.movieName}</p>
        <p><strong>Showtime:</strong> {bookingData.showtime}</p>
        <p><strong>Seats:</strong> {bookingData.selectedSeats.join(", ")}</p>
        <p><strong>Total Price:</strong> ₹{bookingData.totalPrice}</p>
      </div>

      <div className="mt-8">
        <button
          onClick={downloadPdf}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loading && "opacity-50 cursor-not-allowed"}`}
          disabled={loading}
        >
          {loading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
};

export default Confirmation;

