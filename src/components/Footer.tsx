import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='relative w-full flex flex-col justify-end z-20'>
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="w-full h-full transform translate-y-[-10%] md:translate-y-[20%]">
                <Image
                    src="/footer.webp"
                    alt="Footer background"
                    fill
                    className="object-contain object-bottom"
                    priority={false}
                />
            </div>
        </div>
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center pb-20">
            <h2 className="text-5xl lg:text-6xl font-bold text-white tracking-tight">
                Coming Soon...
            </h2>
        </div>
    <div className="relative z-20 bg-white/10 backdrop-blur-md border border-white/20 max-w-5xl w-8/9 md:w-3/4 mx-auto p-6 m-4 rounded-xl shadow-lg flex flex-col justify-between gap-6">
            <div className='flex justify-around items-start gap-4'>
                <div className='flex-shrink-0'>
                    <Image src='/iedclogo.webp' alt='iedc logo' width={80} height={80}/>
                </div>
                <div className='flex justify-end flex-1 text-sm gap-8'>
                    <div className='flex flex-col space-y-2 items-start'>
                        <p className='text-gray-400 font-semibold text-xs uppercase tracking-wide'>CONTACT US</p>
                        <p className='text-white'>+91 7559907591</p>
                        <Link href='https://www.iedc@cev.ac.in' className='text-white/80 hover:text-white transition-colors'>iedc@cev.ac.in</Link>
                    </div>
                    <div className='flex flex-col space-y-2 items-start md:-translate-x-3'>
                        <p className='text-gray-400 font-semibold text-xs uppercase tracking-wide'>ADDRESS</p>
                        <p className='text-white leading-tight'>College of Engineering <br/>Vadakara</p>
                        <Link href='https://www.iedccev.org' className='text-white/80 hover:text-white transition-colors'>iedccev.org</Link>
                    </div>
                </div>
            </div>
            <div className="relative w-full h-16 mt-2"> 
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
