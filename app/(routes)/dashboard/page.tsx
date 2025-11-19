"use client"
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import React, { useContext, useEffect, useState } from 'react'
import { useConvex } from 'convex/react';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { InterviewData } from '../interview/[interviewId]/start/page';
import CreateInterviewDialog from '../_components/CreateInterviewDialog';
import EmptyState from './_components/EmptyState';
import InterviewCards from './_components/InterviewCards';
import { Skeleton } from "@/components/ui/skeleton"

function Dashboard() {
    const {user}=useUser();
    const [interviewList,setInterviewList]=useState<InterviewData[]>([]);
    const {userDetail, setUserDetails}=useContext(UserDetailContext);
    const convex=useConvex();
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        userDetail && GetInterviewDetails();
    },[userDetail])
    const GetInterviewDetails=async()=>{
        setLoading(true);
        const result=await convex.query(api.Interview.GetUserInterviews,{
            uid:userDetail._id
        });
        console.log("Interview Details:",result);
        const transformedList = result.map(item => ({
            ...item,
            jobTitle: item.jobTitle || '', 
            jobDescription: item.jobDescription || '',
            resumeUrl: item.resumeUrl || '',
            feedback: item.feedback || '',
        }));
        setInterviewList(transformedList);
        setLoading(false);
    }


  return (
    <div className='py-20 px-2 md:px-28 '>
        {!loading&&<div className='flex justify-between items-center'>
        <div>
            <h2 className='text-lg text-gray-500'>
                My Dashboard
            </h2>
            <h2 className='text-3xl font-bold'>
                Welcome,{user?.fullName}!
            </h2>
            </div>
            <CreateInterviewDialog />
        </div>}
        {!loading&&
        interviewList.length===0 ? 
        <EmptyState/> :
        <div className="flex flex-wrap gap-5 mt-5 p-2 ">
           {interviewList.map((interview, index) => (
        <InterviewCards interviewInfo={interview} key={index} />
      ))}
        </div>
        }

        {loading&&<div className="flex flex-wrap gap-5 mt-5 p-2">
            {[1,2,3,4,5,6].map((item,index)=>(
                <div className="flex items-center space-x-4" key={index}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
            ))}
        </div>}
        </div>
  )
}

export default Dashboard