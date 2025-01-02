import React, { useState } from "react";
import "./App.css";

const DynamicSeatLayout = () => {
  const [rows, setRows] = useState([
    { name: "Row 1", seats: "1,2,3,null,4,5", price: 300 },
  ]); // Default row for initial display
  const [layout, setLayout] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addNewRow = () => {
    setRows([...rows, { name: `Row ${rows.length + 1}`, seats: "", price: 0 }]);
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const generateLayout = () => {
    const newLayout = rows.map((row) => {
      const seats = row.seats
        .split(",")
        .map((seat) => (seat.trim() === "null" ? null : `${row.name}${seat.trim()}`));
      return { rowLabel: row.name, seats, price: row.price };
    });
    setLayout(newLayout);
  };

  const handleSeatClick = (seat) => {
    if (!seat || reservedSeats.includes(seat)) return; // Ignore reserved or null seats.
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  return (
    <div className="dynamic-seat-layout">
      <h1>Dynamic Seat Layout</h1>

      {/* Configuration Form */}
      <div className="config-form">
        <h2>Configure Theater Layout</h2>
        {rows.map((row, index) => (
          <div key={index} className="row-config">
            <label>
              Row Name:
              <input
                type="text"
                value={row.name}
                onChange={(e) =>
                  handleRowChange(index, "name", e.target.value)
                }
              />
            </label>
            <label>
              Seats (comma-separated):
              <input
                type="text"
                value={row.seats}
                placeholder="e.g., 1,2,3,null,4"
                onChange={(e) =>
                  handleRowChange(index, "seats", e.target.value)
                }
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                value={row.price}
                onChange={(e) =>
                  handleRowChange(index, "price", parseInt(e.target.value) || 0)
                }
              />
            </label>
            <button onClick={() => removeRow(index)} className="remove-btn">
              Remove Row
            </button>
          </div>
        ))}
        <button onClick={addNewRow} className="add-btn">
          Add New Row
        </button>
        <button onClick={generateLayout} className="generate-btn">
          Generate Layout
        </button>
      </div>

      {/* Display Seat Layout */}
      <div className="seat-layout">
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            <span className="row-label">{row.rowLabel}</span>
            {row.seats.map((seat, seatIndex) => (
              <button
                key={seatIndex}
                className={`seat ${
                  !seat
                    ? "gap"
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
                    {seat} <br /> ${row.price}
                  </>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      <div className="selection-summary">
        <h2>Selected Seats:</h2>
        {selectedSeats.length > 0
          ? selectedSeats.join(", ")
          : "No seats selected"}
        <br />
        <strong>
          Total Price: $
          {selectedSeats.reduce((sum, seat) => {
            const row = layout.find((r) =>
              r.seats.includes(seat)
            );
            return sum + (row ? row.price : 0);
          }, 0)}
        </strong>
      </div>
    </div>
  );
};

export default DynamicSeatLayout;
