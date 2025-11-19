import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import CreateInterviewDialog from '../../_components/CreateInterviewDialog'

function EmptyState() {
  return (
    <div className='mt-14 flex flex-col items-center gap-5 border-dashed p-10 border-4 rounded-2xl bg-gray-50'>
        <Image src={'/interview.png'} alt='empty state'
        width={230}
        height={230}
        />
        <div className='mt-2 text-lg text-gray-500'>
            You do not have any interviews yet
        </div>
        <CreateInterviewDialog />
    </div>
  )
}

export default EmptyState