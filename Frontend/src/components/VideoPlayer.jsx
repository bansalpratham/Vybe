import React, { useRef, useState } from 'react'
import { FaVolumeHigh } from "react-icons/fa6";
import { IoMdVolumeOff } from "react-icons/io";

function VideoPlayer({media}) {
    const videoTag = useRef()
   
    const [mute,setMute] = useState(false)
    const [isPlaying,setIsPlaying] = useState(true)
 
    const handleClick = ()=>{
       if (isPlaying)
       {
        videoTag.current.pause()
        setIsPlaying(false)
       }
       else
       {
        videoTag.current.play()
        setIsPlaying(true)
       }
   }

  useEffect(()=>{
    const observer = new  IntersectionObserver((entry)=>{
        const video = videoTag.current
        if (entry.isIntersecting)
        {
          video.play()
          setIsPlaying(true)
        }
        else
        {
          video.pause()
          setIsPlaying(false)
        }
      },{threshold:0.6})

      if (videoTag.current)
      {
        observer.observe(videoTag.current)
      }

      return ()=>{
         if (videoTag.current)
      {
        observer.unobserve(videoTag.current)
      }
      }

  },[])

    return (
    <div className='h-full relative cursor-pointer max-w-full rounded-2xl overflow-hidden'>
        <video ref={videoTag} src={media} autoPlay loop muted={mute} className='h-full cursor-pointer w-full object-cover rounded-2xl' onClick={handleClick} />
        <div className='absolute bottom-2.5 right-2.5' onClick={()=>setMute(prev=>!prev)}>
            {!mute?<FaVolumeHigh className='w-5 h-5 text-white font-semibold' />:<IoMdVolumeOff className='w-5 h-5 text-white font-semibold' />}
        </div>
    </div>
  )
}

export default VideoPlayer
