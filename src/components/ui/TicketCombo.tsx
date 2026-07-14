import React from 'react'

function TicketCombo({size=10, className="", tickets="0"}) {
  return (
    <div className='relative flex h-10 items-center'>
      <img src="/assets/images/ticket.png" className={` w-${size} h-${size} absolute start-0 top-[50%] transform translate-y-[-50%] translate-x-[-20%] -rotate-12 ${className}`} alt="" loading="lazy" />
      <span className='text-gradient-green border border-l-0 border-green-500 rounded-full p-2 px-3 ps-10'>{tickets}</span>
    </div>
  )
}

export default TicketCombo