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
    <div>

        <AddMovie/>
        <div>theatre profile</div>
        <div>
          <button onClick={isProfileFormOpen}>EditProfile</button>
        </div>
          <button onClick={isPhotoFormOpen}>Add Photos</button>
        <div>
        </div>
          <button onClick={isScreenFormOpen}>Add Screen</button>
        <div>
        {profileModal && <FormProfile setProfileModal={setProfileModal}/>}
        {photoModal && <FormPhoto setPhotoModal={setPhotoModal}/>}
        {screenModal && <SeatLayout setScreenModal={setScreenModal}/>}

        </div>
        <div>create screen</div>
        <div>create mivie</div>
    </div>
  )
}

export default Home