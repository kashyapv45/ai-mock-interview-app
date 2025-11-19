import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

type Props = {
    feedbackInfo:FeedbackInfo
}

export type FeedbackInfo={
    feedback:string,
    rating:number,
    suggestion:string,
}

function FeedbackDialog({feedbackInfo}: Props) {
  return (
    <Dialog>
  <DialogTrigger asChild><Button className='bg-primary hover:border-primary border-[1.5px] hover:bg-white hover:text-primary'>View Feedback</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Interview Feedback Information</DialogTitle>
      <DialogDescription className='p-3'>
        <h2 className='font-bold mb-2 text-primary'>
            Feedback:
        </h2>
        <p className='bg-gray-50 rounded-2xl p-3 text-gray-800'>{feedbackInfo?.feedback}</p>
        <h2 className='font-bold mb-2 mt-3 text-primary'>
            Suggestions:
        </h2>
        <p className='bg-gray-50 rounded-2xl p-3 text-gray-800'>{feedbackInfo?.suggestion}</p>
        <h2 className='font-bold flex gap-2 items-center text-primary mt-3'>
            Rating: {feedbackInfo?.rating}/10<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        </h2>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default FeedbackDialog