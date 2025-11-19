import React from 'react'
import { InterviewData } from '../../interview/[interviewId]/start/page'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import FeedbackDialog from './FeedbackDialog'
import ViewResumeDialog from './ResumeDialog'

type Props = {
  interviewInfo: InterviewData
}

const DESCRIPTION_THRESHOLD = 200;

function InterviewCards({ interviewInfo }: Props) {

  const isDescriptionLong = (interviewInfo?.jobDescription?.length || 0) > DESCRIPTION_THRESHOLD;

  return (
    <div className='mt-5 flex flex-wrap gap-3 flex-row'>
      <Card className='w-90 shrink-0 '>
        <CardHeader>
          <CardTitle>
            <div className='whitespace-nowrap'>{interviewInfo?.jobTitle}</div>
            <Badge className='mt-1'>{interviewInfo?.status}</Badge>
          </CardTitle>
          <CardDescription></CardDescription>
          <CardAction>{interviewInfo?.resumeUrl && <ViewResumeDialog resumeInfo={{ resumeUrl: interviewInfo.resumeUrl }} />}</CardAction>
        </CardHeader>

        <CardContent className='text-sm text-gray-500'>
          {isDescriptionLong ? (
            <div className="space-y-2">
              <p>Description:</p>
              <div className="max-h-32 overflow-y-auto p-2 rounded-md border bg-gray-50/50">
                <p className="whitespace-pre-wrap">{interviewInfo?.jobDescription}</p>
              </div>
            </div>
          ) : (
            <>
              Description: {interviewInfo?.jobDescription}
            </>
          )}
        </CardContent>

        <CardFooter className='flex justify-content items-center gap-2'>
          {interviewInfo?.feedback && <FeedbackDialog feedbackInfo={interviewInfo?.feedback} />}
          <Link href={`/interview/${interviewInfo?._id}`} className='flex items-right'>
            <Button variant={'outline'} className='border-purple-600 hover:bg-purple-600 hover:text-white'>
              Start Interview<ArrowRight className="ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default InterviewCards
