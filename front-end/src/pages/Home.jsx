import React, {useState, useEffect} from 'react'
import FormProfile from '../components/FormProfile'
import FormPhoto from '../components/FormPhoto'
import SeatLayout from '../components/SeatLayout';
import AddMovie from '../components/AddMovie';
import Movies from '../components/Movies';
import ManageShows from '../components/ManageShows.jsx';
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    navigate("/login"); // Redirect to login page
  };

  const [profileModal,setProfileModal]=useState(false);
  const [photoModal,setPhotoModal]=useState(false);
  const [screenModal,setScreenModal]=useState(false);
  const isProfileFormOpen=()=>{
    setProfileModal(true)
  }
  const isPhotoFormOpen=()=>{
    setPhotoModal(true)
  }
  const isScreenFormOpen=()=>{
    setScreenModal(true)
  }
  return (
    
<div className="bg-[#1a1a1a] text-[#cec3c8] min-h-screen p-8 justify-center align-center">
  
<header className="bg-black text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="text-2xl font-bold cursor-pointer text-[#db0a5b]" onClick={() => navigate("/")}>
          Movie Theater
        </div>
        <nav>
          <ul className="flex space-x-6">
            
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
  <div className="text-[#db0a5b] font-semibold text-xl mt-8">Theater Profile</div>

  <div className='w-100 flex flex-row justify-evenly'>
  <div className="mt-4">
    <button
      onClick={isProfileFormOpen}
      className="bg-[#db0a5b] text-white px-6 py-3 rounded-lg hover:bg-[#f62459] transition"
    >
      Edit Profile
    </button>
  </div>

  <div className="mt-4">
    <button
      onClick={isPhotoFormOpen}
      className="bg-[#db0a5b] text-white px-6 py-3 rounded-lg hover:bg-[#f62459] transition"
    >
      Add Photos
    </button>
  </div>

  <div className="mt-4">
    <button
      onClick={isScreenFormOpen}
      className="bg-[#db0a5b] text-white px-6 py-3 rounded-lg hover:bg-[#f62459] transition"
    >
      Add Screen
    </button>
  </div>

  </div>

  <div className="mt-8">
    {profileModal && <FormProfile setProfileModal={setProfileModal} />}
    {photoModal && <FormPhoto setPhotoModal={setPhotoModal} />}
    {screenModal && <SeatLayout setScreenModal={setScreenModal} />}
  </div>
  <AddMovie />
    <Movies/>
    <ManageShows/>
</div>

  )
}

export default Home