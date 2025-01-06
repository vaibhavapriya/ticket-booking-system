import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageShows = () => {
  const theaterId = localStorage.getItem('userid');
  const [shows, setShows] = useState([]);
  const [newShow, setNewShow] = useState({
    theaterId: "",
    screenId: "",
    movieId: "",
    movieName: "",
    tmdbId: "",
    showDate: "",
    price: "",
    totalSeats: "",
  });
  const [editingShowId, setEditingShowId] = useState(null);
  const [editedShow, setEditedShow] = useState({});

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const response = await axios.get(`https://ticket-booking-system-7vpl.onrender.com/api/shows/bytheater/${theaterId}`);
      setShows(response.data);
    } catch (error) {
      console.error("Error fetching shows:", error);
    }
  };


  return (
<div className="manage-shows-container bg-[#2d2d2d] min-h-screen p-6">

  {/* Show List */}
  <div className="show-list bg-[#2d2d2d] p-6 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold text-white mb-4">Show List</h2>
    <table className="w-full border-collapse border border-[#e0e0e0]">
      <thead>
        <tr className="bg-[#db0a5b] text-white ">
          <th className="p-3 border border-[#e0e0e0] ">Movie Name</th>
          <th className="p-3 border border-[#e0e0e0]">Screen ID</th>
          <th className="p-3 border border-[#e0e0e0]">Show Date</th>
          <th className="p-3 border border-[#e0e0e0]">Price</th>
          <th className="p-3 border border-[#e0e0e0]">Total Seats</th>
        </tr>
      </thead>
      <tbody>
  {shows.length === 0 ? (
    <tr>
      <td colSpan="5" className="p-3 text-center text-white">
        No shows available
      </td>
    </tr>
  ) : (
    shows.map((show, index) => (
      <tr
        key={show._id}
        className={`hover:bg-[#f4e4f6] ${
          index % 2 === 0 ? "bg-[#333]" : "bg-[#444]"
        }`}
      >
        <td className="p-3 border border-[#e0e0e0] text-white">
          {show.movieName}
        </td>
        <td className="p-3 border border-[#e0e0e0] text-white">
          {show.screenId ? show.screenId.screenName : "Not Assigned"}
        </td>
        <td className="p-3 border border-[#e0e0e0] text-white">
          {new Date(show.showDate).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td className="p-3 border border-[#e0e0e0] text-white">
        ₹{show.price}
        </td>
        <td className="p-3 border border-[#e0e0e0] text-white">
          {show.totalSeats}
        </td>
      </tr>
    ))
  )}
</tbody>

    </table>
  </div> 
</div>
  );
};

export default ManageShows;
