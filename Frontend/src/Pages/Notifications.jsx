import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import LeftHome from '../components/LeftHome'
import RightHome from '../components/RightHome'
import Nav from '../components/Nav'
import dp from "../assets/dp.png"
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaComment, FaUserPlus, FaRegBell } from 'react-icons/fa6'
import { ClipLoader } from 'react-spinners'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/notification`, { withCredentials: true })
      setNotifications(response.data)
      
      // Mark as read after fetching
      await axios.put(`${serverUrl}/api/notification/read`, {}, { withCredentials: true })
    } catch (error) {
      console.error("Fetch notifications error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "just now"
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHour < 24) return `${diffHour}h ago`
    return `${diffDay}d ago`
  }

  const renderIcon = (type) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-red-500" size={16} />
      case 'comment':
        return <FaComment className="text-blue-500" size={16} />
      case 'follow':
        return <FaUserPlus className="text-green-500" size={16} />
      default:
        return <FaRegBell className="text-gray-500" size={16} />
    }
  }

  return (
    <div className='w-full flex justify-center items-center bg-black min-h-screen'>
      <LeftHome />

      {/* Notifications Body */}
      <div className='lg:w-[50%] w-full bg-black min-h-screen lg:h-screen relative lg:overflow-y-auto flex flex-col'>
        <div className='w-full p-5 border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between'>
          <h1 className='text-white text-2xl font-bold tracking-wide'>Notifications</h1>
          <button 
            className='text-xs text-blue-400 font-bold hover:underline cursor-pointer'
            onClick={fetchNotifications}
          >
            Refresh
          </button>
        </div>

        {/* Content Box */}
        <div className='flex-1 w-full bg-white rounded-t-[50px] mt-2 p-6 flex flex-col items-center gap-4 relative pb-28 min-h-[75vh]'>
          <Nav />

          {loading ? (
            <div className='mt-20 flex flex-col items-center gap-3'>
              <ClipLoader color='black' size={40} />
              <p className='text-gray-500 font-semibold text-sm'>Loading updates...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className='mt-20 flex flex-col items-center text-center px-6 gap-2'>
              <FaRegBell size={48} className='text-gray-300' />
              <h3 className='text-[18px] font-bold text-gray-700 mt-2'>All quiet for now</h3>
              <p className='text-gray-400 text-sm max-w-72'>When other users like, comment on your posts, or follow you, updates will show up here.</p>
            </div>
          ) : (
            <div className='w-full max-w-140 flex flex-col gap-2 mt-4'>
              {notifications.map((notif, index) => (
                <div 
                  key={notif._id || index}
                  className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all duration-200 cursor-pointer ${
                    notif.isRead 
                      ? 'bg-neutral-55 hover:bg-neutral-100 border-gray-100' 
                      : 'bg-blue-50/40 hover:bg-blue-50/70 border-blue-100/30 ring-1 ring-blue-500/5'
                  }`}
                  onClick={() => navigate(`/profile/${notif.sender?.userName}`)}
                >
                  <div className='flex items-center gap-3.5 flex-1 pr-4'>
                    {/* User Avatar + Small Badge */}
                    <div className='relative'>
                      <div className='w-12 h-12 rounded-full overflow-hidden border border-gray-200'>
                        <img src={notif.sender?.profileImage || dp} alt="" className='w-full h-full object-cover' />
                      </div>
                      <div className='absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-gray-100 shadow-sm'>
                        {renderIcon(notif.type)}
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className='flex flex-col gap-0.5 text-sm'>
                      <div>
                        <span className='font-bold text-black hover:text-blue-500 mr-1.5 transition-colors'>
                          {notif.sender?.userName}
                        </span>
                        <span className='text-gray-600'>
                          {notif.type === 'follow' && 'started following you.'}
                          {notif.type === 'like' && (notif.loop ? 'liked your loop.' : 'liked your post.')}
                          {notif.type === 'comment' && (notif.loop ? 'commented on your loop.' : 'commented on your post.')}
                        </span>
                      </div>
                      
                      <div className='flex items-center gap-2 mt-0.5'>
                        <span className='text-xs text-gray-400 font-medium'>
                          {getRelativeTime(notif.createdAt)}
                        </span>
                        {!notif.isRead && (
                          <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Post / Loop Preview attachment */}
                  {notif.post && (
                    <div className='w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0'>
                      <img src={notif.post.media} alt="" className='w-full h-full object-cover' />
                    </div>
                  )}
                  {notif.loop && (
                    <div className='w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-950 flex-shrink-0 flex items-center justify-center'>
                      <div className='w-2 h-2 rounded-full bg-white animate-pulse' />
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <RightHome />
    </div>
  )
}

export default Notifications
