import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AnimatedReveal from '@/components/AnimatedReveal'

export default function Footer({ hideHero }: { hideHero?: boolean } = {}) {
  return (
    <footer className= {!hideHero ? 'relative w-full flex flex-col justify-end z-20 py-10' : 'relative w-full flex flex-col justify-end z-0 py-10'}>
        {!hideHero && (
          <>
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="w-full h-full transform translate-y-[-30%] md:translate-y-[-10%] lg:translate-y-[-10%]">
                    <Image
                        src="/page-assets/footer.webp"
                        alt="Footer background"
                        fill
                        className="object-contain object-bottom"
                        priority={false}
                    />
                </div>
            </div>
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center pb-20">
                <AnimatedReveal text="Stay tuned." as="h2" className="text-5xl lg:text-6xl font-bold text-white tracking-tight" split="chars" />
            </div>
          </>
        )}
    <div className="relative z-20 bg-white/10 backdrop-blur-md border border-white/20 max-w-5xl w-8/9 md:w-3/4 mx-auto p-6 m-4 rounded-xl shadow-lg flex flex-col justify-between gap-6">
            <div className='flex justify-around items-start gap-4'>
                <div className='flex-shrink-0'>
                    <Image src='/page-assets/iedclogo.webp' alt='iedc logo' width={80} height={80}/>
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
                    src="/page-assets/logo.webp"
                    alt="evolvia logo"
                    fill
                    className="object-contain"
                />
            </div>
        </div>
    </footer>
  )
}
