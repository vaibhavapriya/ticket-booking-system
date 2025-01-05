import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SeatBookingPage = () => {
  const { id } = useParams(); // Get show ID from URL
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [show, setShow] = useState(null);

  useEffect(() => {
    const fetchSeatLayout = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shows/${id}`);
        const { seats, price } = response.data;
        setSeats(seats);
        setShow(response.data);
        setTotalPrice(0); // Reset total price on load
      } catch (error) {
        console.error('Error fetching seat layout:', error);
      }
    };

    fetchSeatLayout();
  }, [id]);

  // Handle seat selection
  const toggleSeatSelection = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId)); // Unselect seat
      setTotalPrice(totalPrice - show.price);
    } else {
      setSelectedSeats([...selectedSeats, seatId]); // Select seat
      setTotalPrice(totalPrice + show.price);
    }
  };

  // Render seats
  const renderSeats = () => {
    return seats.map((seat) => {
      const isSelected = selectedSeats.includes(seat._id);
      const isBooked = seat.booked;

      let seatClass = 'seat white'; // Default to available seat
      if (isBooked) seatClass = 'seat grey'; // Booked seat
      if (isSelected) seatClass = 'seat green'; // Selected seat

      return (
        <div
          key={seat._id}
          className={`seat ${seatClass}`}
          onClick={() => !isBooked && toggleSeatSelection(seat._id)} // Disable click on booked seats
        >
          {seat.number}
        </div>
      );
    });
  };

  return (
    <div className="seat-booking-page">
      <h2>{show?.movieName} - Select Your Seats</h2>
      <div className="seats-grid">
        {renderSeats()}
      </div>
      <div className="total-price">
        <p>Total Price: {totalPrice} INR</p>
      </div>
      <button
        className="btn-book"
        disabled={selectedSeats.length === 0}
        onClick={() => alert('Proceeding to Payment')}
      >
        Book Selected Seats
      </button>
    </div>
  );
};

export default SeatBookingPage;
