import React from 'react'
import { useSelector } from 'react-redux'
import dp from "../assets/dp.png"
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'

function OtherUser({user}) {
    const {userData} = useSelector(state=>state.user)
    const navigate = useNavigate()
  return (
    <div className='w-full p-3 flex items-center justify-between rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 group'>
      <div className='flex items-center gap-3'>
          <div 
            className='w-11 h-11 rounded-full cursor-pointer overflow-hidden ring-1 ring-white/10 group-hover:ring-blue-400/50 transition-all duration-300' 
            onClick={()=>navigate(`/profile/${user.userName}`)}
          >
              <img src={user.profileImage || dp} alt="" className='w-full h-full object-cover' />
          </div>
          <div>
              <div className='text-[15px] text-white font-semibold tracking-wide cursor-pointer hover:text-blue-400 transition-colors' onClick={()=>navigate(`/profile/${user.userName}`)}>{user.userName}</div>
              <div className='text-[13px] text-gray-400 font-medium truncate max-w-28'>{user.name}</div>
          </div>
      </div>
      <FollowButton 
        tailwind={'px-3 py-1 text-[13px] font-semibold bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-md'} 
        targetUserId={user._id} 
      />
    </div>
  )
}

export default OtherUser
