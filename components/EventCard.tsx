import React from 'react'
import Link from "next/link"    
import Image from 'next/image'
interface Props{
    title:string;
    image:string;
    slug:string;
    location:string;
    date:string;
    time:string;
}
const EventCard = ({title,image,slug,location,date,time}:Props) => {
  return (
    <Link href={'/events/${slug}'} id="event-card">
        <Image src={image} alt={title} width={410} height={300} className="paster"></Image>
        <div className='flex flex-row gap-2'>
            <Image src="pin.svg" alt="Location Pin" width={14} height={14} />
            <p>{location}</p>
        </div>
        <p className='title'>{title}</p>
        <div className='dattime'>
            <div>
                <Image src="calendar.svg" alt="Calendar Icon" width={14} height={14}/>
               <p>{date}</p>
            </div>
        </div>
        <div>
            <Image src="clock.svg" alt="Clock Icon" width={14} height={14}/>
           <p>{time}</p>
        </div>
    </Link>
  )
}

export default EventCard