import React from 'react'

function Ticket({size=10, className=""}) {
  return (
    <div className={``}>
        <img src="/assets/images/ticket.png" className={` w-${size} h-${size} ${className}`} alt="" loading="lazy" />
        <span className=''></span>
    </div>
  )
}

export default Ticket