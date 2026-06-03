import React, { useEffect, useRef, useState } from 'react'
import { FaHeart, FaRegHeart, FaVolumeHigh } from 'react-icons/fa6'
import { IoMdVolumeOff } from 'react-icons/io'
import dp from "../assets/dp.png"
import FollowButton from './FollowButton'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineComment } from "react-icons/md";
import { setLoopData } from '../redux/loopSlice'
import axios from 'axios'
import { serverUrl } from '../App'
import { IoSend } from 'react-icons/io5'

function LoopCard({ loop }) {
  const videoRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isMute, setIsMute] = useState(false)
  const [progress , setProgress] = useState(0)
  const [showHeart , setShowHeart] = useState(false)
  const [showComment , setShowComment] = useState(false)
  const [message,setMessage] = useState("")
  const {userData} = useSelector(state=>state.user)
  const {loopData} = useSelector(state=>state.loop)

  const dispatch = useDispatch()

  const commentRef = useRef()

  const handleTimeUpdate = ()=>{
    const video = videoRef.current
    if (video)
    {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }
  }

  
  const handleLikeOnDoubleClick = ()=>{
    setShowHeart(true)
    setTimeout(()=>setShowHeart(false),6000)
    {!loop.likes?.includes(userData._id) ? handleLike():null}
  }
  
  const handleClick = () => {
    const video = videoRef.current
    
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      video.play()
      setIsPlaying(true)
    }
  }
  
  const handleMute = (e) => {
    e.stopPropagation()
    
    const video = videoRef.current
    
    if (!video) return
    
    video.muted = !video.muted
    setIsMute(video.muted)
  }
  
  const handleLike = async()=>{
    try {
      const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`,{withCredentials: true})
      const updatedLoop = result.data
      
      const updatedLoops = loopData.map(p=>p._id==loop._id?updatedLoop:p)
      dispatch(setLoopData(updatedLoops))
    } catch (error) {
      console.log(error)
    }
  }

  const handleComment = async()=>{
    try {
      const result = await axios.post(`${serverUrl}/api/loop/comment/${loop._id}`,{message},{withCredentials: true})
      const updatedLoop = result.data
      
      const updatedLoops = loopData.map(p=>p._id==loop._id?updatedLoop:p)
      dispatch(setLoopData(updatedLoops))
      setMessage("")
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(()=>{
    const handleClickOutside =  (event)=>{
      if (commentRef.current && !commentRef.current.contains(event.target))
      {
        setShowComment(false)
      }
    }

    if (showComment)
    {
      document.addEventListener("mousedown",handleClickOutside)
    }
    else
    {
       document.removeEventListener("mousedown",handleClickOutside)
    }

  },[showComment])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current

        if (!video) return

        if (entry.isIntersecting) {
          video.play().catch(() => {})
          setIsPlaying(true)
        } else {
          video.pause()
          setIsPlaying(false)
        }
      },
      { threshold: 0.6 }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full h-screen flex justify-center items-center bg-black overflow-hidden">
      <div className="relative h-full aspect-9/16 border-l border-r border-gray-800 overflow-hidden bg-black">

   {showHeart && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50'>
      <FaHeart className='w-25 cursor-pointer h-25 text-white drop-shadow-2xl' />
    </div>}

    <div ref={commentRef} className={`absolute z-200 bottom-0  w-full h-125 p-2.5 rounded-t-4xl bg-[#0e1718] transition-transform duration-500 ease-in-out left-0 shadow-2xl shadow-black ${showComment ? "translate-y-0" : "translate-y-full" } `}>
        <h1 className='text-white text-[20px] text-center font-semibold'>Comments</h1>
        <div className='w-full h-87.5 overflow-y-auto flex flex-col gap-5'>
          {loop.comments.length == 0 && <div className='text-center text-white text-[20px] font-semibold mt-12.5'>
              No Comments Yet
            </div>}
          {loop.comments.map((com,index)=>(
              <div className='w-full flex flex-col gap-1.25 border-b border-gray-800 justify-center pb-2.5 mt-2.5'>
                    <div className='flex justify-start items-center md:gap-5 gap-2.5'>
                         <div className='w-10 h-10 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                                <img src={com.author?.profileImage || dp} alt="" className='w-full object-cover' />
                            </div>
                            <div className='w-37.5 font-semibold text-white truncate'>{com.author.userName}</div>
                            </div>
                    <div className='text-white pl-15'>{com.message}</div>        
              </div>
          ))}
        </div>
        <div className='w-full fixed bottom-0 h-20 flex items-center justify-between px-5 py-5 '>
                <div className='w-10 h-10 md:w-15 md:h-15 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                  <img src={loop.author?.profileImage || dp} alt="" className='w-full object-cover' />
                </div> 
                <input type="text" className='px-2.5 border-b-2 placeholder:text-white text-white border-b-gray-500 w-[90%] outline-none h-10' placeholder='Write Comment....' onChange={(e)=>setMessage(e.target.value)} value={message} />
                {message && <button className='absolute right-5'><IoSend className='w-6.25 text-white h-6.25' onClick={(handleComment)} /></button>}
                </div>
    </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          src={loop?.media}
          onClick={handleClick}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-contain cursor-pointer"
          onDoubleClick={handleLikeOnDoubleClick}
        />
        <button
          onClick={handleMute}
          className="absolute top-5 right-5 z-100 bg-black/40 p-2 rounded-full"
        >
          {isMute ? (
            <IoMdVolumeOff className="w-5 h-5 text-white" />
          ) : (
            <FaVolumeHigh className="w-5 h-5 text-white" />
          )}
        </button>

        <div className='absolute bottom-0 w-full h-1.25 bg-gray-900'>
          <div className='w-50 h-full bg-white transition-all duration-200 ease-linear' style={{width:`${progress}%`}} >
          </div>
        </div>

        <div className='w-full absolute h-25 bottom-2.5 p-2.5 flex flex-col gap-2.5 '>
            <div className='flex items-center gap-1.25'>
                 <div className='w-7.5 h-7.5 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                        <img src={loop.author?.profileImage || dp} alt="" className='w-full object-cover' />
                    </div>
                    <div className='w-30 truncate text-white font-semibold '>{loop.author.userName}</div>
            <FollowButton targetUserId={loop.author?._id}  tailwind={"px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white "} />
                    </div>
                    <div className='text-white px-2.5 '>
                      {loop.caption}
                    </div>

          <div className='absolute right-0 flex flex-col gap-5 text-white bottom-37.5 justify-center px-2.5'>

          <div className='flex flex-col items-center cursor-pointer'>
            <div onClick={handleLike} >
              {!loop.likes.includes(userData._id) && <FaRegHeart className='w-6.25 cursor-pointer h-6.25' />}
              {loop.likes.includes(userData._id) && <FaHeart className='w-6.25 cursor-pointer h-6.25 text-red-600' />}
            </div>
            <div>
              {loop.likes.length}
            </div>
          </div>

          <div className='flex flex-col items-center cursor-pointer' onClick={()=>setShowComment(true)} >
            <div><MdOutlineComment className='w-6.25 cursor-pointer h-6.25 ' /></div>
            <div>{loop.comments.length}</div>
          </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default LoopCard