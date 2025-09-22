import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className='absolute bottom-10 w-full p-4'>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 max-w-5xl mx-auto p-6 rounded-xl shadow-lg ">
            <div className='flex justify-between mb-4'>
                <div className='mr-4'>
                    <Image src='/iedclogo.webp' alt='iedc logo' width={100} height={100}/>
                </div>
                <div className='flex justify-between text-sm '>
                    <div className='flex flex-col mr-4'>
                        <p>CONTACT US</p>
                        <p>+91 8075595509</p>
                        <p>EMAIL</p>
                        <Link href='https://www.gmail.com'>iedccev.org</Link>
                    </div>
                    <div className='flex flex-col'>
                        <p>ADDRESS</p>
                        <p>College of Engineering Vadakara,</p>
                    <Link href='https://www.iedccev.org'>iedccev.org</Link>
                    </div>
                </div>
            </div>
            <div className="relative w-full h-30"> 
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
