import React from 'react';
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

function App() {

  return (
    <>
      <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/company/:id" element={<Home/>} />
                <Route path="/home" element={<Website/>} />
                <Route path="/movie/:tmdbId" element={<Movie/>} />
                <Route path="/book/:tmdbId" element={<BookTickets/>} />
            </Routes>
      </Router>
    </>
  )
}

export default App
