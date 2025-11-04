"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react'
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { createContext } from 'vm';

function Providers({children}:any) {

  const {user}=useUser();
  const CreateUser=useMutation(api.users.CreateNewUser);
  const [userDetail,setUserDetail]=useState<any>();

  useEffect(()=>{
    user && CreateNewUser();
  },[user])

  const CreateNewUser=async()=>{
    if (user){
    const result=await CreateUser({
      email:user?.primaryEmailAddress?.emailAddress??'',
      imageUrl:user?.imageUrl,
      name:user?.fullName??''
    });
    setUserDetail(result);
    }
  }


  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
    <div>{children}</div></UserDetailContext.Provider>
  )
}

export default Providers

export const useUserDetailContext = () => {
  return createContext(UserDetailContext);
};