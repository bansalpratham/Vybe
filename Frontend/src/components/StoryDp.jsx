import React from 'react'
import dp from "../assets/dp.png"
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function StoryDp({ProfileImage,userName,story}) {
  const naviagte = useNavigate()
  const {userData} = useSelector(state=>state.user)
  const handleClick = ()=>{
    if (!story && userName == "Your Story") {
      naviagte("/upload")
    }
    else
    {
      if (story && userName == "Your Story"){
        naviagte(`/story/${userData.userName}`)
      }
    }
  }

  return (
    <div className='flex flex-col w-20'>
      <div className={`w-20 h-20 ${story ? "bg-linear-to-b from-blue-500 to-blue-950" : ""} rounded-full flex justify-center items-center relative`} onClick={handleClick}>
        <div className='w-17.5 h-17.5 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
              <img src={ProfileImage || dp} alt="" className='w-full object-cover' />
              {!story && userName=="Your Story" && <div>
                 <CiCirclePlus className='text-black absolute bottom-2 right-2.5 rounded-full bg-white w-5.5 h-5.5'/>
              </div> }
          </div>
          </div>
          <div className='text-[14px] text-center truncate w-full text-white'>{userName}</div>
    </div>
  )
}

export default StoryDp
