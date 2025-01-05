import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SeatBooking = () => {
  const { id } = useParams(); // Get show ID from URL
  const navigate = useNavigate();
  
  const [seats, setSeats] = useState([]); // Stores seat layout data
  const [selectedSeats, setSelectedSeats] = useState([]); // Tracks selected seats
  const [totalPrice, setTotalPrice] = useState(0); // Tracks total price
  const [showData, setShowData] = useState(null); // Holds fetched show data

  useEffect(() => {
    const fetchSeatLayout = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shows/${id}`);
        setShowData(response.data);
        setSeats(response.data.screenId.rows); // Extract rows from the screenId object
        setTotalPrice(0); // Reset total price on load
      } catch (error) {
        console.error('Error fetching seat layout:', error);
      }
    };

    fetchSeatLayout();
  }, [id]);

  const handleSeatClick = (seat) => {
    console.log(`Seat clicked: ${seat}`);

    // Prevent booking if the seat is already booked
    if (showData.bookedSeats.includes(seat)) {
      alert(`Seat ${seat} is already booked.`);
      return;
    }

    // If seat is already selected, unselect it
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      setTotalPrice((prevTotal) => prevTotal - showData.price);
    } else {
      // If seat is not selected, select it
      setSelectedSeats((prevSelected) => [...prevSelected, seat]);
      setTotalPrice((prevTotal) => prevTotal + showData.price);
    }
    console.log(selectedSeats)
  };

  const handleSubmit = async () => {
    try {
      // Send selected seats to the backend to update bookedSeats
      const response = await axios.post(`/api/book-seats/${id}`, { selectedSeats });
      alert('Seats booked successfully!');
      console.log(response.data); // Updated show data with new booked seats
      navigate(`/confirmation/${id}`); // Redirect to confirmation page
    } catch (error) {
      alert('Error booking seats: ' + error.response.data.message);
    }
  };

  // Render seat layout based on rows and seats
  const renderSeats = () => {
    return seats.map((row, rowIndex) => (
      <div key={rowIndex} className="flex mb-2">
        <div className="mr-4 font-bold">{row.rowLabel}</div> {/* Row Label */}
        {row.seats.map((seat, index) => {
          if (seat === null) {
            return (
              <div
                key={`null-${index}`}
                style={{ width: '40px', height: '40px', margin: '5px' }}
              ></div> // Placeholder for null seats
            );
          }

          const isBooked = showData.bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          return (
            <button
              key={seat}
              onClick={() => handleSeatClick(seat)}
              className={`${isBooked ? 'bg-gray-500' : isSelected ? 'bg-green-500' : 'bg-white-500'} px-2 py-1 rounded`}
              disabled={isBooked}
            >
              {seat}
            </button>
          );
        })}
      </div>
    ));
  };

  if (!showData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Seat Booking for {showData.movieName}</h1>
      <div className="seat-layout">{renderSeats()}</div>
      <div className="total-price">
        <p>Total Price: ₹{totalPrice}</p>
      </div>
      <div className="total-price">
        <p>Selected Seats: {selectedSeats}</p>
      </div>
      <button onClick={handleSubmit} className="booking-btn">
        Confirm Booking
      </button>
    </div>
  );
};

export default SeatBooking;
