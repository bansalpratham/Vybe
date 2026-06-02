import React from 'react'
import logo from '../assets/logo.png'
import { FaRegHeart } from "react-icons/fa";
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import Post from './Post';

function Feed() {
  const {postData} = useSelector(state=>state.post)
  return (
    <div className='lg:w-[50%] w-full bg-black min-h-screen lg:h-screen relative lg:overflow-y-auto'>
     <div className='w-full h-25 flex items-center justify-between p-5 lg:hidden'>
             <img src={logo} alt="" className='w-20' />
             <div>
     <FaRegHeart className='text-[white] w-6.25 h-6.25 ' />
             </div>
           </div>
           <div className='flex w-full overflow-auto gap-2.5 items-center p-5'>
            <StoryDp userName={"wdnwk"} />
            <StoryDp userName={"wdnwk"} />
            <StoryDp userName={"wdnwk"} />
            <StoryDp userName={"wdnwk"} />
            <StoryDp userName={"wdnwk"} />
            <StoryDp userName={"wdnwk"} />
            <StoryDp userName={"wdnwk"} />
            <StoryDp userName={"wdnwk"} />
            <StoryDp userName={"wdnwk"} />
            <StoryDp userName={"wdnwk"} />
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
