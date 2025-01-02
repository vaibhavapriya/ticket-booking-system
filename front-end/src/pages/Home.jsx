import React, {useState, useEffect} from 'react'
import FormProfile from '../components/client/FormProfile'

function Home() {
  const [profileModal,setProfileModal]=useState(false);
  const isProfileFormOpen=()=>{
    setProfileModal(true)
  }
  return (
    <div>
        {profileModal && <FormProfile setProfileModal={setProfileModal}/>}
        <div>teatre profiel</div>
        <div>
          <button onClick={isProfileFormOpen}>EditProfile</button>
        </div>
        <div>create screen</div>
        <div>create mivie</div>
    </div>
  )
}

export default Home