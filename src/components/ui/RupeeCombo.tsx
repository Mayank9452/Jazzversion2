import React from 'react'

function RupeeCombo({size=10, className="", tickets="0"}) {
  return (
    <div className={`relative flex h-10 items-center`}>
      {/* <img src="/assets/images/rupee.png" className={` w-${size} h-${size} absolute start-0 top-[50%] transform translate-y-[-50%] translate-x-[-20%] rotate-[20deg] ${className}`} alt="" loading="lazy" /> */}
      <span className={` w-${size} h-${size} text-6xl absolute start-0 top-[50%] transform translate-y-[-60%] translate-x-[-60%] rotate-[20deg] ${className}`}>🎁</span>
      <div className='border text-black font-bold border-l-0 border-[#01FFB4] bg-[#01FFB4] rounded-full py-1 px-4 ps-10 text-xl'>{tickets}</div>
    </div>
  )
}

export default RupeeCombo