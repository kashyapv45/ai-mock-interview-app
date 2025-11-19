'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Send, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

function Interview() {
  const { interviewId} =  useParams();
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyLink = () => {
    const linkToCopy = window.location.href + '/start';
    
    navigator.clipboard.writeText(linkToCopy) 
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };
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
        <div className='flex gap-2 w-full max-w-xl mt-3 justify-center'>
        <Link href={'/interview/'+interviewId+'/start'}>
        <Button>Start Interview <ArrowRight/> </Button>
        </Link>
        <Button onClick={handleCopyLink} 
              disabled={isCopied}>{isCopied ? 'Copied Link' : 'Share Link'} 
              {isCopied ? <Check /> : <Send />}</Button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Interview