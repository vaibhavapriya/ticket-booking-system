import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 

import './App.css'

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Website from './pages/Website';
import Movie from './pages/Movie';
import BookTickets from './pages/BookTickets';
import SeatBooking from './pages/SeatBooking';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import ViewBookings from './pages/ViewBookings';
import TheaterTickets from './pages/TheaterTickets';
import ReportsDashboard from './components/ReportDashboard';

function App() {
  const [showData, setShowData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  return (
    <>
      <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/company/:id" element={<Home/>} />
                <Route path="/" element={<Website/>} />
                <Route path="/movie/:tmdbId" element={<Movie/>} />
                <Route path="/book/:tmdbId" element={<BookTickets/>} />
                <Route path="/book-seats/:id" element={<SeatBooking/>}/>
                <Route path="/payment" element={<Payment/>} />
                <Route path="/confirmation" element={<Confirmation/>} />
                <Route path="/viewbookings" element={<ViewBookings/>}/>
                <Route path="/t/:theaterID" element={<TheaterTickets/>}/>
                <Route path="/reports" element={<ReportsDashboard />} />
                {/* showData={showData} setShowData={setShowData} selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} totalPrice={totalPrice} */}
            </Routes>
      </Router>
    </>
  )
}

export default App
