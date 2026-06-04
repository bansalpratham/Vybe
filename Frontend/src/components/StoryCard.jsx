import React from 'react'
import dp from "../assets/dp.png"
import { useSelector } from 'react-redux'
import { IoMdArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

function StoryCard() {
    const {storyData} = useSelector(state=>state.story)
    const navigate = useNavigate()
    return (
        <div className='w-full max-w-125 h-screen border-x-2 border-gray-800 pt-2.5 relative flex flex-col justify-center'>
            <div className='flex items-center gap-2.5 absolute top-5 px-2.5'>
                <IoMdArrowBack  className='text-white w-6.25 h-6.25 cursor-pointer' onClick={()=>navigate("/")} />
                <div className='w-7.5 h-7.5 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={storyData.author?.profileImage || dp} alt="" className='w-full object-cover' />
                </div>
                <div className='w-30 truncate text-white font-semibold '>{storyData?.author?.userName}</div>
            </div>

        
        
        </div>
    )
}

export default StoryCard
