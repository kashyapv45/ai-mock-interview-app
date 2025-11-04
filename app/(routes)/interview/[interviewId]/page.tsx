'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Send } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

function Interview() {
  const { interviewId} =  useParams();
  return (
    <div className='flex items-center justify-center mt-14'>
    <div className='flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl p-6 w-full max-w-4xl gap-8'>
      <Image src={'/liveinterview.png'} alt="Interview" 
      width={600} 
      height={400}
      className='rounded-2xl border border-gray-300 shadow-xl'
      />
      <div className='p-6 flex-col items-center justify-center gap-6 flex'>
        <h2 className='font-bold text-3xl text-center'>Ready to start Interview?</h2>
        <Link href={'/interview/'+interviewId+'/start'}>
        <Button>Start Interview <ArrowRight/> </Button>
        </Link>
        <hr />
        <div className='p-6 bg-gray-100 rounded-2xl border border-gray-200 shadow-xl'>
        <h2 className='font-semibold text-2xl'>Want to share interview link?</h2>
        <div className='flex gap-2 w-full max-w-xl mt-3'>
        <Input className='w-full max-w-xl border bg-gray-50 border-gray-200' placeholder='Email address' />
        <Button><Send/> </Button>
        </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Interview