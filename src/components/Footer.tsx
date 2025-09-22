import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className='absolute bottom-8 w-full p-4'>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 max-w-4xl mx-auto p-6 rounded-xl shadow-lg ">
            <div className='flex justify-between mb-4 gap-4'>
                <div className='mr-4'>
                    <Image src='/iedclogo.webp' alt='iedc logo' width={100} height={100}/>
                </div>
                <div className='flex justify-between text-sm gap-6'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-gray-500'>CONTACT US</p>
                        <p>+91 7559907591</p>
                        <p>EMAIL</p>
                        <Link href='https://www.iedc@cev.ac.in'>iedc@cev.ac.in</Link>
                    </div>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-gray-500'>ADDRESS</p>
                        <p>College of Engineering Vadakara,</p>
                    <Link href='https://www.iedccev.org'>iedccev.org</Link>
                    </div>
                </div>
            </div>
            <div className="relative w-full h-28"> 
            <Image
                src="/logo.webp"
                alt="evolvia logo"
                fill
                className="object-contain"
            />
            </div>
        </div>
    </div>
  )
}
