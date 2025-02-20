import React, { useState } from "react";

const SeatLayout = ({setScreenModal}) => {
  const theaterId = localStorage.getItem('userid');
  const [screenName, setScreenName] = useState("");
  const [rows, setRows] = useState([
    { name: "Row A", seats: "1,2,3,null,4,5" },
  ]); // Default row for initial display
  const [layout, setLayout] = useState([]);
  const [totalSeats, setTotalSeats] = useState(0);

  // Handle changes to row configuration
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Add a new row
  const addNewRow = () => {
    setRows([...rows, { name: `Row ${String.fromCharCode(65 + rows.length)}`, seats: "" }]);
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
              : `${row.name}${seat.trim()}`
          );
        return { rowLabel: row.name, seats };
      });
    setLayout(newLayout);

    // Calculate total seats excluding gaps
    const total = newLayout.reduce(
      (sum, row) => sum + row.seats.filter((seat) => seat !== null).length,
      0
    );
    setTotalSeats(total);
  };
  const saveLayout = async () => {
    if (!screenName) {
      alert("Screen name is required!");
      return;
    }
    try {
      const payload = {
        screenName,
        totalSeats,
        rows: layout,
        theaterId,
      };
  
      const response = await fetch("https://ticket-booking-system-7vpl.onrender.com/api/screens/saveLayout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("Layout saved successfully!");
        setScreenModal(false);
      } else {
        const data = await response.json();
        alert(`Error saving layout: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving layout:", error);
      alert("Error saving layout");
    }
  };
  const cancle = () =>{
    setScreenModal(false)
  }

  return (
  <div className="dynamic-seat-layout bg-white text-[#b0b0b0] min-h-screen p-6 max-w-screen-md mx-auto">
    <h1 className="text-3xl font-bold text-[#db0a5b] mb-8">Dynamic Seat Layout</h1>

    {/* Screen Name Input */}
    <div className="mb-6">
      <label className="block text-lg font-medium text-[#b0b0b0] mb-2">
        Screen Name:
      </label>
      <input
        type="text"
        value={screenName}
        onChange={(e) => setScreenName(e.target.value)}
        placeholder="Enter Screen Name"
        className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db0a5b] bg-white text-black"
      />
    </div>

    {/* Configuration Form */}
    <div className="config-form bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold text-[#db0a5b] mb-4">
        Configure Theater Layout
      </h2>
      <div className="text-[#cec3c8] text-sm mb-4">
        Note: If you want to give space between names, use "null". For the whole space between rows, let the seats be "null".
      </div>
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
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db0a5b] bg-white text-black"
            />
          </label>
          <label className="block text-sm font-medium text-[#cec3c8] mb-2">
            Seats (comma-separated):
            <input
              type="text"
              value={row.seats}
              placeholder="e.g., 1,2,3,null,4,5"
              onChange={(e) => handleRowChange(index, "seats", e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#db0a5b] bg-white text-black"
            />
          </label>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => removeRow(index)}
              className="remove-btn bg-[#9c4b8b] text-white px-4 py-2 rounded-lg hover:bg-[#db0a5b] transition"
            >
              Remove Row
            </button>
            <button
              onClick={() => clearRow(index)}
              className="clear-btn bg-[#9c4b8b] text-white px-4 py-2 rounded-lg hover:bg-[#db0a5b] transition"
            >
              Clear Row
            </button>
          </div>
        </div>
      ))}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={addNewRow}
          className="add-btn bg-[#9c4b8b] text-white px-4 py-2 rounded-lg hover:bg-[#f62459] transition"
        >
          Add New Row
        </button>
        <button
          onClick={generateLayout}
          className="generate-btn bg-[#9c4b8b] text-white px-4 py-2 rounded-lg hover:bg-[#db0a5b] transition"
        >
          Generate Layout
        </button>
      </div>
    </div>

    {/* Display Seat Layout */}
    <div className="seat-layout bg-[#333333] p-6 rounded-lg shadow-md">
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
                    ? "bg-transparent"
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

    <div className="mt-6">
      <p className="text-lg font-semibold text-[#cec3c8]">Total Seats: {totalSeats}</p>
    </div>

    <button
      onClick={saveLayout}
      className="save-btn mt-6 bg-[#db0a5b] text-white px-6 py-3 rounded-lg hover:bg-[#f62459] transition"
    >
      Save Layout
    </button>
    <button
      onClick={cancle}
      className="cancel-btn mt-6 bg-[#db0a5b] ml-5 text-white px-6 py-3 rounded-lg hover:bg-[#f62459] transition"
    >
      Cancel
    </button>
  </div>
  );
};

export default SeatLayout;
