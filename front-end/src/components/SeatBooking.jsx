import React, { useState } from "react";
import "./App.css";

const SeatLayout = () => {
  const layout = [
    { rowLabel: "Premium", seats: ["P1", "P2", "P3", null, "P4", "P5", "P6"] }, // Premium row with a gap
    { rowLabel: "A", seats: ["A1", "A2", "A3", "A4", null, "A5", "A6", "A7"] }, // Regular row with a gap
    { rowLabel: "B", seats: ["B1", "B2", "B3", "B4"] }, // Shorter row
    { rowLabel: "C", seats: ["C1", "C2", "C3", null, null, "C4"] }, // Row with empty spaces
  ];

  const reservedSeats = ["P2", "A5", "C3"]; // Reserved seats
  const pricing = {
    P1: 500,
    P2: 500,
    P3: 500,
    P4: 500,
    P5: 500,
    P6: 500,
    A1: 300,
    A2: 300,
    A3: 300,
    A4: 300,
    A5: 300,
    A6: 300,
    A7: 300,
    B1: 200,
    B2: 200,
    B3: 200,
    B4: 200,
    C1: 100,
    C2: 100,
    C3: 100,
    C4: 100,
  };

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seat) => {
    if (!seat || reservedSeats.includes(seat)) return; // Ignore reserved or null seats
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  return (
    <div className="seat-layout">
      <h1>Seat Selection</h1>
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="seat-row">
          <span className="row-label">{row.rowLabel}</span>
          {row.seats.map((seat, seatIndex) => (
            <button
              key={seatIndex}
              className={`seat ${
                !seat
                  ? "gap" // Handle gaps
                  : reservedSeats.includes(seat)
                  ? "reserved"
                  : selectedSeats.includes(seat)
                  ? "selected"
                  : "available"
              }`}
              onClick={() => handleSeatClick(seat)}
              disabled={!seat || reservedSeats.includes(seat)}
            >
              {seat && (
                <>
                  {seat} <br /> ${pricing[seat]}
                </>
              )}
            </button>
          ))}
        </div>
      ))}
      <div className="selection-summary">
        <h2>Selected Seats:</h2>
        {selectedSeats.length > 0
          ? selectedSeats.join(", ")
          : "No seats selected"}
        <br />
        <strong>
          Total Price: $
          {selectedSeats.reduce((sum, seat) => sum + pricing[seat], 0)}
        </strong>
      </div>
    </div>
  );
};

export default SeatLayout;
