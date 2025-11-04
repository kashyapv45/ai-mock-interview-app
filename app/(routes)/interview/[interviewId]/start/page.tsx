'use client'
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'

type InterviewData={
  jobTitle:string|null,
  jobDescription:string|null,
  interviewQuestions:InterviewQuestions[],
  userId:string |null,
  _id:string,
}

type InterviewQuestions={
  answer:string,
  question:string,
}

function StartInterview() {
  const { interviewId} =  useParams();
  const convex=useConvex();
  const [interviewData,setInterviewData]=useState<InterviewData>();
  useEffect(()=>{
    GetInterviewQuestions();
  },[interviewId])


  const GetInterviewQuestions=async()=>{
    const result=await convex.query(api.Interview.GetInterviewQuestions,{
      //@ts-ignore  
      interviewRecordId:interviewId
    });
    console.log("Interview Questions",result);
    setInterviewData(result?.[0]);
  }
    return (
    <div>StartInterview</div>
  )
}

export default StartInterview