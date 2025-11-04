import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

function JobDescription({onHandleInputChange}:any) {
  return (
    <div>
        <div>
        <label>
            Job Title
        </label>
        <Input placeholder="Ex. Software Engineer" 
        onChange={(event)=>onHandleInputChange('jobTitle',event.target.value)}/>
        </div>
        <div className='mt-6'>
        <label>
            Job Description
        </label>
        <Textarea placeholder="Enter Job Description" className='h-[200px]' 
        onChange={(event)=>onHandleInputChange('jobDescription',event.target.value)}/>
    </div>
    </div>
  )
}

export default JobDescription