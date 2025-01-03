import React, { useState } from "react";
import "./seatLayout.css";

const SeatLayout = () => {
  const [rows, setRows] = useState([
    { name: "Row 1", seats: "1,2,3,null,4,5" },
  ]); // Default row for initial display
  const [layout, setLayout] = useState([]);

  // Handle changes to row configuration
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Add a new row
  const addNewRow = () => {
    setRows([...rows, { name: `Row ${rows.length + 1}`, seats: "" }]);
  };

  // Remove a row
  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  // Clear a row (make it empty)
  const clearRow = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].seats = ""; // Set seats to empty
    setRows(updatedRows);
  };

  // Generate the layout from rows
  const generateLayout = () => {
    const newLayout = rows
      .filter((row) => row.seats.trim() !== "") // Skip rows with empty `seats`
      .map((row) => {
        const seats = row.seats
          .split(",")
          .map((seat) =>
            seat.trim() === "null" || seat.trim() === ""
              ? null
              : `${row.name}-${seat.trim()}`
          );
        return { rowLabel: row.name, seats };
      });
    setLayout(newLayout);
  };
  const saveLayout = async () => {
    const theaterName = prompt("Enter Theater Name:");
  
    if (!theaterName) {
      alert("Theater name is required!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/saveLayout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theaterName, rows: layout }),
      });
  
      if (response.ok) {
        alert("Layout saved successfully!");
      } else {
        const data = await response.json();
        alert(`Error saving layout: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving layout:", error);
      alert("Error saving layout");
    }
  };
  

  return (
<div className="dynamic-seat-layout bg-[#1a1a1a] text-[#cec3c8] min-h-screen p-6">
  <h1 className="text-3xl font-bold text-[#db0a5b] mb-8">Dynamic Seat Layout</h1>

  {/* Configuration Form */}
  <div className="config-form bg-[#2d2d2d] p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-2xl font-semibold text-[#db0a5b] mb-4">
      Configure Theater Layout
    </h2>
    {rows.map((row, index) => (
      <div
        key={index}
        className="row-config mb-6 p-4 border border-[#db0a5b] rounded-lg"
      >
        <label className="block text-sm font-medium text-[#cec3c8] mb-2">
          Row Name:
          <input
            type="text"
            value={row.name}
            onChange={(e) => handleRowChange(index, "name", e.target.value)}
            className="w-full p-2 mt-1 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db0a5b] bg-[#1a1a1a] text-[#cec3c8]"
          />
        </label>
        <label className="block text-sm font-medium text-[#cec3c8] mb-2">
          Seats (comma-separated):
          <input
            type="text"
            value={row.seats}
            placeholder="e.g., 1,2,3,null,4"
            onChange={(e) => handleRowChange(index, "seats", e.target.value)}
            className="w-full p-2 mt-1 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db0a5b] bg-[#1a1a1a] text-[#cec3c8]"
          />
        </label>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => removeRow(index)}
            className="remove-btn bg-[#6e304b] text-white px-4 py-2 rounded-lg hover:bg-[#db0a5b] transition"
          >
            Remove Row
          </button>
          <button
            onClick={() => clearRow(index)}
            className="clear-btn bg-[#6e304b] text-white px-4 py-2 rounded-lg hover:bg-[#db0a5b] transition"
          >
            Clear Row
          </button>
        </div>
      </div>
    ))}
    <div className="flex space-x-4 mt-6">
      <button
        onClick={addNewRow}
        className="add-btn bg-[#db0a5b] text-white px-4 py-2 rounded-lg hover:bg-[#f62459] transition"
      >
        Add New Row
      </button>
      <button
        onClick={generateLayout}
        className="generate-btn bg-[#db0a5b] text-white px-4 py-2 rounded-lg hover:bg-[#f62459] transition"
      >
        Generate Layout
      </button>
    </div>
  </div>

  {/* Display Seat Layout */}
  <div className="seat-layout bg-[#2d2d2d] p-6 rounded-lg shadow-md">
    {layout.map((row, rowIndex) => (
      <div key={rowIndex} className="seat-row flex items-center mb-4">
        <span className="row-label w-16 font-medium text-[#cec3c8]">
          {row.rowLabel}
        </span>
        <div className="flex space-x-2">
          {row.seats.map((seat, seatIndex) => (
            <div
              key={seatIndex}
              className={`seat w-10 h-10 flex items-center justify-center rounded-lg text-white ${
                !seat
                  ? "gap bg-transparent"
                  : "available bg-[#6e304b] hover:bg-[#db0a5b] transition"
              }`}
            >
              {seat}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

  <button
    onclick={saveLayout}
    className="save-btn mt-6 bg-[#db0a5b] text-white px-6 py-3 rounded-lg hover:bg-[#f62459] transition"
  >
    Save Layout
  </button>
</div>

  );
};

export default SeatLayout;
