import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.png"
import { useSelector } from 'react-redux'
import { IoMdArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { FaEye } from 'react-icons/fa'

function StoryCard({storyData}) {

    const navigate = useNavigate()
    const {userData} = useSelector(state=>state.user)

    const [progress,setProgress] = useState(0)

    useEffect(()=>{
        if (!storyData) return
        const interval = setInterval(()=>{
            setProgress(prev=>{
                if (prev>=100) {
                    clearInterval(interval)
                    navigate("/")
                    return 100;
                }
                return prev+1
            })
        },150)
        return ()=>clearInterval(interval)
    },[navigate, storyData])

    if (!storyData) {
        return (
            <div className="w-full max-w-125 h-screen border-x-2 border-gray-800 pt-2.5 relative flex flex-col justify-center items-center bg-black text-white">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800"></div>
                    <div className="h-4 w-24 bg-gray-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full max-w-125 h-screen border-x-2 border-gray-800 pt-2.5 relative flex flex-col justify-center'>
            <div className='flex items-center gap-2.5 absolute top-7.5 px-2.5'>
                <IoMdArrowBack  className='text-white w-6.25 h-6.25 cursor-pointer' onClick={()=>navigate("/")} />
                <div className='w-7.5 h-7.5 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={storyData.author?.profileImage || dp} alt="" className='w-full object-cover' />
                </div>
                <div className='w-30 truncate text-white font-semibold '>{storyData?.author?.userName}</div>
            </div>

        <div className='w-[full] h-[90vh] flex items-center justify-center'>
  {storyData.mediaType=="image" && <div className='w-[90%] flex items-center justify-center'>
    <img src={storyData.media} alt=""  className='w-[80%] rounded-2xl object-cover ' />
    </div>}

    {storyData.mediaType=="video" && <div className='w-[80%] flex flex-col items-center justify-center '>
      <VideoPlayer media={storyData.media} />
    </div>}
    
        </div> 

       <div className='absolute top-2.5 w-full h-1.25 bg-gray-900'>
          <div className='w-50 h-full bg-white transition-all duration-200 ease-linear' style={{width:`${progress}%`}} >
          </div>
        </div>

       {storyData?.author?.userName==userData?.userName && <div className='absolute w-full flex items-center text-white h-17.5 bottom-0 p-2 left-0'>
                <div className='text-white flex items-center gap-1.25'><FaEye/>{storyData.viewers.length}</div>
                 <div className='flex relative'>
                
                                            {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                
                                                <div
                                                    key={viewer?._id || index}
                                                    style={{ left: `${index * 9}px` }}
                                                    className='w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden absolute'
                                                >
                
                                                    <img
                                                        src={viewer?.profileImage || dp}
                                                        alt=""
                                                        className='w-full h-full object-cover'
                                                    />
                
                                                </div>
                
                                            ))}
                
                                        </div>
        </div>}
        
        </div>
    )
}

export default StoryCard
