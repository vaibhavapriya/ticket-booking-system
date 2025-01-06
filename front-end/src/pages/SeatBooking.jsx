import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SeatBooking = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); 
  const [totalPrice, setTotalPrice] = useState(0);
  const [showData, setShowData] = useState(null); 

  useEffect(() => {
    const fetchSeatLayout = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shows/${id}`);
        const { show, theater } = response.data;  // Destructure the show and theater data
        
        console.log('Fetched Show Data:', show);
        console.log('Theater Data:', theater);
        
        setShowData(show);  // Set show data after fetching
        
        // After setting showData, update seats from showData
        if (show && show.screenId && show.screenId.rows) {
          setSeats(show.screenId.rows);  // Set seats based on rows from screenId
        }

        setTotalPrice(0); // Reset the total price on data fetch
      } catch (error) {
        console.error('Error fetching seat layout:', error);
      }
    };

    fetchSeatLayout();
  }, [id]);

  const handleSeatClick = (seat) => {
    console.log(`Seat clicked: ${seat}`);

    if (showData.bookedSeats.includes(seat)) {
      alert(`Seat ${seat} is already booked.`);
      return;
    }

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
      setTotalPrice((prevTotal) => prevTotal - showData.price);
    } else {
      setSelectedSeats((prevSelected) => [...prevSelected, seat]);
      setTotalPrice((prevTotal) => prevTotal + showData.price);
    }
    console.log(selectedSeats);
  };

  const handleSubmit = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
  
    navigate(`/payment`, {
      state: {
        movieName: showData.movieName,
        theaterName: showData.theaterName,
        location: showData.location,
        screenName: showData.screenName,
        selectedSeats,
        totalPrice,
      },
    });
  };

  const renderSeats = () => {
    return seats.map((row, rowIndex) => (
      <div key={rowIndex} className="flex mb-4">
        <div className="mr-4 font-bold text-xl text-white">{row.rowLabel}</div>
        {row.seats.map((seat, index) => {
          if (seat === null) {
            return (
              <div
                key={`null-${index}`}
                className="w-10 h-10 mx-1 bg-gray-300" // Placeholder for null seats
              ></div>
            );
          }

          const isBooked = showData.bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          return (
            <button
              key={seat}
              onClick={() => handleSeatClick(seat)}
              className={`${isBooked ? 'bg-gray-500' : isSelected ? 'bg-green-500' : 'bg-white'} w-10 h-10 mx-1 rounded-lg border border-gray-400 hover:bg-green-200 focus:outline-none`}
              disabled={isBooked}
            >
              <span className="text-white">{seat}</span>
            </button>
          );
        })}
      </div>
    ));
  };

  if (!showData) {
    return <div className="text-center text-xl font-semibold text-white">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-white">Seat Booking for {showData.movieName}</h1>
      <div className="seat-layout mb-6">{renderSeats()}</div>

      <div className="total-price text-xl mb-4 text-white">
        <p><strong>Total Price:</strong> ₹{totalPrice}</p>
      </div>
      <div className="total-price text-xl mb-4 text-white">
        <p><strong>Selected Seats:</strong> {selectedSeats.join(', ')}</p>
      </div>

      <button 
        onClick={handleSubmit} 
        className="booking-btn bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Book Ticket
      </button>
    </div>
  );
};

export default SeatBooking;
