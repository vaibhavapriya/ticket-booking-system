import React, {useState, useEffect} from 'react'
import FormProfile from '../components/FormProfile'
import FormPhoto from '../components/FormPhoto'
import SeatLayout from '../components/seatLayout';
import AddMovie from '../components/AddMovie';

function Home() {
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
  <AddMovie />

  <div className="text-[#db0a5b] font-semibold text-xl mt-8">Theatre Profile</div>

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

  <div className="text-[#db0a5b] font-semibold text-xl mt-8">shedule show</div>

  <div className="text-[#db0a5b] font-semibold text-xl mt-4">Create Movie</div>
</div>

  )
}

export default Home