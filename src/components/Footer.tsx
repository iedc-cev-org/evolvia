import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='relative w-full p-4 z-20'>
        <div className=" bg-white/10 backdrop-blur-md border border-white/20 max-w-3xl mx-auto p-4 rounded-xl shadow-lg flex flex-col justify-center gap-4 h-[50vh]">
            <div className='flex justify-between mb-4 gap-4'>
                <div className='mr-4'>
                    <Image src='/iedclogo.webp' alt='iedc logo' width={100} height={100}/>
                </div>
                <div className='flex justify-between lg:min-w-4 text-sm gap-6'>
                    <div className='flex flex-col space-y-1 items-start'>
                        <p className='text-gray-500'>CONTACT US</p>
                        <p>+91 7559907591</p>
                        <Link href='https://www.iedc@cev.ac.in'>iedc@cev.ac.in</Link>
                    </div>
                    <div className='flex flex-col space-y-1 items-start'>
                        <p className='text-gray-500'>ADDRESS</p>
                        <p>College of Engineering <br/>Vadakara,</p>
                    <Link href='https://www.iedccev.org'>iedccev.org</Link>
                    </div>
                </div>
            </div>
            <div className="relative w-full h-22"> 
            <Image
                src="/logo.webp"
                alt="evolvia logo"
                fill
                className="object-contain"
            />
            </div>
        </div>
    </footer>
  )
}
