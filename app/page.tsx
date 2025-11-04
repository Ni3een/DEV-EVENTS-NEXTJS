import ExploreBtn from '@/components/ExploreBtn'
import React from 'react'
import EventCard from '@/components/EventCard'
import {Events} from '@/lib/constansts'
const page = () => {
  return (
    <section>
      <h1 className='text-center'>The Hub For Every Dev <br/>Event You Can't Miss Bitch</h1>
             <p>Hackathon,Meetups and Conferences,All in One Place</p>

      <ExploreBtn />

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>

        <ul className='events'>
          {Events.map((event) => (
            <li key={event.title}>
              <EventCard {...event}/>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page