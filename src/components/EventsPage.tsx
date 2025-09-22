import React from 'react'
import { preEvents } from './eventLists';
import Image from 'next/image'

export default function EventsPage() {
  return (
    <div className='px-2'>
      <div className='max-w-5xl mx-auto'>
        <p className='text-4xl md:text-5xl my-6'>Ongoing Pre events</p>
        <div className='font-extralight text-md'>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe doloremque deleniti omnis vero quaerat magnam, quibusdam obcaecati quis debitis? Accusamus asperiores libero aliquid assumenda quisquam magnam suscipit dolorem fugiat similique.
        </div>
        <div className='bg-amber-400  grid lg:grid-cols-2 gap-4 p-4'>
            {
               preEvents.map((item, index) => (
                <div className='bg-amber-800 rounded-sm items-center'
                    key={index}>
                    <div>{item.name}</div>
                    <Image
                        src={item.image || "/placeholder.png"} 
                        alt='Event logo'
                        width={100}
                        height={100}
                    />
                </div>
                ))
            }
        </div>
      </div>
    </div>
  )
}
