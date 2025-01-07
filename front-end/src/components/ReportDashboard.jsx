import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


const ReportsDashboard = () => {
  const [bookingTrends, setBookingTrends] = useState([]); // Booking trends data
  const [occupancyRates, setOccupancyRates] = useState([]); // Occupancy rates data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    navigate("/login"); // Redirect to login page
  };

  // Fetch reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch both reports concurrently
        const [trendsResponse, occupancyResponse] = await Promise.all([
          axios.get("https://ticket-booking-system-7vpl.onrender.com/api/reports/booking-trends"),
          axios.get("https://ticket-booking-system-7vpl.onrender.com/api/reports/theater-occupancy"),
        ]);

        // Validate and set booking trends
        setBookingTrends(Array.isArray(trendsResponse.data) ? trendsResponse.data : []);
        // Validate and set occupancy rates
        setOccupancyRates(Array.isArray(occupancyResponse.data) ? occupancyResponse.data : []);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchReports();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center">Loading Reports...</h1>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-500 text-center">
          {error}
        </h1>
      </div>
    );
  }

  const chartData = {
    labels: bookingTrends.map((trend) => trend._id || "Unknown"), // Movie names
    datasets: [
      {
        label: "Total Revenue ($)",
        data: bookingTrends.map((trend) => trend.totalRevenue || 0),
        backgroundColor: "rgb(255, 0, 234)", // Pinkish color
        borderColor: "rgb(255, 0, 195)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
        <header className="bg-black text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="text-2xl font-bold cursor-pointer text-[#db0a5b]" onClick={() => navigate("/")}>
          Movie Theater
        </div>
        <nav>
          <ul className="flex space-x-6">
          <li
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => navigate("/reports")}
                >
                  Report
                </li>
            
          <li
                  className="cursor-pointer hover:text-gray-300"
                  onClick={() => navigate("/login")}
                >
                  Login
                </li>
                <li
                  className="cursor-pointer text-red-500 hover:text-red-400"
                  onClick={handleLogout}
                >
                  Logout
                </li>

          </ul>
        </nav>
      </div>
    </header>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#db0a5b]">MOVIES BOOKEd BY USERS IN THE PLATFORM </h1>
      <h3 className="text-rose-50 ">Use this to shedule shows</h3>

      {/* Booking Trends Section */}
      <section className="mb-8 mt-8">
        <h2 className="text-xl font-semibold mb-2 text-[#db0a5b]">Booking Trends</h2>
        <div className="overflow-auto border border-gray-300 rounded-lg shadow-md">
          <table className="table-auto w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Movie Name</th>
                <th className="border px-4 py-2 text-left">Total Revenue</th>
                <th className="border px-4 py-2 text-left">Total Bookings</th>
              </tr>
            </thead>
            <tbody>
              {bookingTrends.length > 0 ? (
                bookingTrends.map((trend, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                  >
                    <td className="border px-4 py-2">{trend._id || "Unknown"}</td>
                    <td className="border px-4 py-2">{`$${(trend.totalRevenue || 0).toFixed(2)}`}</td>
                    <td className="border px-4 py-2">
                      {trend.totalBookings || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center border px-4 py-2 text-gray-500"
                  >
                    No booking trends available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      
      <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#db0a5b]">Booking Trends Chart</h2>
          <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-md">
            <Bar data={chartData} />
          </div>
        </section>

      {/* Theater Occupancy Rates Section */}
      <section>
        <h2 className="text-xl font-semibold mb-2 text-[#db0a5b]">Theater Occupancy Rates</h2>
        <div className="overflow-auto border border-gray-300 rounded-lg shadow-md">
          <table className="table-auto w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Movie Name</th>
                <th className="border px-4 py-2 text-left">Show Date</th>
                <th className="border px-4 py-2 text-left">Occupancy Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {occupancyRates.length > 0 ? (
                occupancyRates.map((rate, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                  >
                    <td className="border px-4 py-2">
                      {rate.movieName || "Unknown"}
                    </td>
                    <td className="border px-4 py-2">
                      {rate.showDate
                        ? new Date(rate.showDate).toLocaleDateString()
                        : "Unknown"}
                    </td>
                    <td className="border px-4 py-2">
                      {rate.occupancyRate
                        ? rate.occupancyRate.toFixed(2)
                        : "0.00"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center border px-4 py-2 text-gray-500"
                  >
                    No occupancy rates available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
    </div>

  );
};

export default ReportsDashboard;
