import React, { useEffect, useRef, useState } from 'react'
import { FaVolumeHigh } from 'react-icons/fa6'
import { IoMdVolumeOff } from 'react-icons/io'

function LoopCard({ loop }) {
  const videoRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isMute, setIsMute] = useState(false)
  const [progress , setProgress] = useState(0)

  const handleTimeUpdate = ()=>{
    const video = videoRef.current
    if (video)
    {
      const percent = (video.currentTime / video.duration) * 100
      setProgress(percent)
    }
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
    <div className="w-full h-screen flex justify-center items-center bg-black">
      <div className="relative h-full aspect-9/16 border-l border-r border-gray-800 overflow-hidden bg-black">
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

        <div className='w-full absolute h-25 bottom-2.5'>

        </div>

      </div>
    </div>
  )
}

export default LoopCard