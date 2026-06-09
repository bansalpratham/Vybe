import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { FaRegHeart } from "react-icons/fa";
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import Post from './Post';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';

function Feed() {
  const {postData} = useSelector(state=>state.post)
  const {userData} = useSelector(state=>state.user)
   const {storyList,currentUserStory} = useSelector(state=>state.story)
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/notification`, { withCredentials: true })
        const unread = res.data.filter(n => !n.isRead).length
        setUnreadCount(unread)
      } catch (err) {
        console.log(err)
      }
    }
    if (userData) {
      checkNotifications()
    }
  }, [userData])

  return (
    <div className='lg:w-[50%] w-full bg-black min-h-screen lg:h-screen relative lg:overflow-y-auto'>
     <div className='w-full h-25 flex items-center justify-between p-5 lg:hidden'>
             <img src={logo} alt="" className='w-20 cursor-pointer' onClick={() => navigate("/")} />
             <div 
                className="p-2 hover:bg-white/5 rounded-full cursor-pointer relative"
                onClick={() => navigate("/notifications")}
              >
                <FaRegHeart className='text-[white] w-6.25 h-6.25 ' />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </div>
           </div>
           <div className='flex w-full overflow-auto gap-2.5 items-center p-5'>
            <StoryDp userName={"Your Story"}  profileImage={userData.profileImage} story={currentUserStory} />
           
          {storyList?.map((story,index)=>(
            <StoryDp userName={story.author.userName} profileImage={story.author.profileImage} story={story} key={index} />
          ))}

           </div>

    <div className='w-full min-h-screen flex flex-col items-center gap-5 p-2.5 pt-10 bg-white rounded-t-[60px] relative pb-30'>
    <Nav/>

    {postData?.map((post,index)=>(
      <Post post={post} key={index} />
    ))}

    </div>

    </div>
  )
}

export default Feed
