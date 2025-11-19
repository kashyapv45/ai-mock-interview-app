import React, { useContext, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import ResumeUpload from './ResumeUpload'
import JobDescription from './JobDescription'
import axios from 'axios'
import { Loader2Icon } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function CreateInterviewDialog() {
  const [formData, setFormData] = useState<{ jobTitle?: string, jobDescription?: string }>();
  const [file, setFiles] = useState<File | null>();
  const [loading, setLoading] = useState(false);
  
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const saveInterviewQuestions = useMutation(api.Interview.SaveInterviewQuestion);

  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const onSubmit = async () => {
    setLoading(true);
    const formData_ = new FormData();
    formData_.append('file', file ?? ''); 
    formData_?.append('jobTitle', formData?.jobTitle ?? '');
    formData_?.append('jobDescription', formData?.jobDescription ?? '');

    try {
      const res = await axios.post('/api/generate-interview-questions', formData_);
      console.log(res.data);

      if (res?.data?.status == 429) {
        toast.warning('Not enough credits to generate interview questions. Please upgrade your plan or wait for 24 hours for credits to refill.');
        setLoading(false);
        return;
      }

      const interviewId = await saveInterviewQuestions({
        questions: res.data?.questions,
        resumeUrl: res.data?.resumeUrl ?? null,
        userId: userDetail?._id,
        jobTitle: formData?.jobTitle ?? null,
        jobDescription: formData?.jobDescription ?? null,
      });

      router.push('/interview/' + interviewId);

    } catch (e) {
      console.log(e);
      toast.error("Something went wrong while generating questions.");
    } finally {
      setLoading(false);
    }
  }

  const isFormValid = file && formData?.jobTitle && formData?.jobDescription;

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Create Interview</Button>
      </DialogTrigger>

      <DialogContent className='min-w-3xl max-h-[90dvh] flex flex-col'>
        
        <DialogHeader className="shrink-0">
          <DialogTitle>Create New Interview</DialogTitle>
          <DialogDescription>
            Please fill out all fields below to generate your interview.
            <span className='text-red-600 block mt-1'>All fields are required.</span>
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-6 py-4 overflow-y-auto'>
          <JobDescription onHandleInputChange={onHandleInputChange} />
          <ResumeUpload setFiles={(file: File) => setFiles(file)} />
        </div>
        
        <DialogFooter className='flex gap-6 shrink-0'>
          <DialogClose>
            <Button variant={'ghost'}>Cancel</Button>
          </DialogClose>
          
          <Button 
            onClick={onSubmit} 
            disabled={!isFormValid || loading}
          >
            {loading && <Loader2Icon className='animate-spin mr-2' />} 
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateInterviewDialog