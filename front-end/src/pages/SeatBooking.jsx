import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faParking, faWheelchair } from '@fortawesome/free-solid-svg-icons';

const SeatBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showData, setShowData] = useState(null);
  const [theaterData, setTheaterData] = useState(null);

  useEffect(() => {
    const fetchSeatLayout = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shows/${id}`);
        const { show, theater } = response.data;

        setShowData(show);
        setTheaterData(theater);

        if (show?.screenId?.rows) {
          setSeats(show.screenId.rows);
        }
        setTotalPrice(0);
      } catch (error) {
        console.error('Error fetching seat layout:', error);
      }
    };

    fetchSeatLayout();
  }, [id]);

  const handleSeatClick = (seat) => {
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
  };

  const handleSubmit = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    navigate(`/payment`, {
      state: {
        showId :showData._id,
        movieName: showData.movieName,
        theaterName: theaterData.name,
        theaterLocation: theaterData.address + theaterData.city,
        screenName: showData.screenId.screenName,
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
                className="w-10 h-10 mx-1 bg-gray-300"
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

  if (!showData || !theaterData) {
    return <div className="text-center text-xl font-semibold text-white">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 text-white">
        <h1 className="text-3xl font-bold text-center">Movie: {showData.movieName}</h1>
        <h2 className="text-2xl font-semibold text-center mt-2">Theater: {theaterData.name}</h2>
        <p className="text-center text-lg">Location:{theaterData.address || ""} {theaterData.city || "Not Available"}</p>
        <div className="flex justify-center space-x-6 mt-4">
          <FontAwesomeIcon
            icon={faUtensils}
            className={`text-2xl ${theaterData.food ? 'text-green-500' : 'text-gray-500'}`}
            title="Food & Beverages"
          />
          <FontAwesomeIcon
            icon={faParking}
            className={`text-2xl ${theaterData.parking ? 'text-green-500' : 'text-gray-500'}`}
            title="Parking"
          />
          <FontAwesomeIcon
            icon={faWheelchair}
            className={`text-2xl ${theaterData.handicapFacility ? 'text-green-500' : 'text-gray-500'}`}
            title="Handicap Facility"
          />
        </div>
      </div>

      <div className="seat-layout mb-6">{renderSeats()}</div>

      <div className="text-xl mb-4 text-white">
        <p><strong>Total Price:</strong> ₹{totalPrice}</p>
        <p><strong>Selected Seats:</strong> {selectedSeats.join(', ')}</p>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Book Ticket
      </button>
    </div>
  );
};

export default SeatBooking;
