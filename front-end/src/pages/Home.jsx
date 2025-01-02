import React, {useState, useEffect} from 'react'
import FormProfile from '../components/client/FormProfile'
import FormPhoto from '../components/FormPhoto'

function Home() {
  const [profileModal,setProfileModal]=useState(false);
  const [photoModal,setPhotoModal]=useState(false);
  const isProfileFormOpen=()=>{
    setProfileModal(true)
  }
  const isPhotoFormOpen=()=>{
    setPhotoModal(true)
  }
  return (
    <div>
        {profileModal && <FormProfile setProfileModal={setProfileModal}/>}
        {photoModal && <FormPhoto setPhotoModal={setPhotoModal}/>}
        <div>teatre profiel</div>
        <div>
          <button onClick={isProfileFormOpen}>EditProfile</button>
        </div>
          <button onClick={isPhotoFormOpen}>Add Photos</button>
        <div>

        </div>
        <div>create screen</div>
        <div>create mivie</div>
    </div>
  )
}

export default Home