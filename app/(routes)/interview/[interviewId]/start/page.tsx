'use client'
import { api } from '@/convex/_generated/api';
import { useConvex, useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image'
import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react' 
import Vapi from '@vapi-ai/web';
import { useUser} from '@clerk/nextjs';
import { Mic, MicOff, Phone, Timer } from 'lucide-react';
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner';
import axios from 'axios';
import { FeedbackInfo } from '@/app/(routes)/dashboard/_components/FeedbackDialog';


export type InterviewData={
jobTitle:string,
jobDescription:string,
interviewQuestions:InterviewQuestions[],
userId:string,
_id:string,
resumeUrl:string,
status:string,
feedback:FeedbackInfo | null,
}

type InterviewQuestions={
answer:string,
question:string,
}

function StartInterview() {
const randomImageSrc = useMemo(() => {
const randomIndex = Math.floor(Math.random() * 2) + 1; 
return `/interviewer_${randomIndex}.png`;
}, []);
const {interviewId} = useParams();
const convex=useConvex();
const {user, isLoaded }=useUser();
const [interviewData,setInterviewData]=useState<InterviewData>();
const [activeUser,setActiveUser]=useState(false); 
const [isCallActive, setIsCallActive] = useState(false);
const conversationRef = useRef<any>(null);
const updateFeedback=useMutation(api.Interview.UpdateFeedback);
const router = useRouter();
const [timeLeft, setTimeLeft] = useState(15 * 60);


useEffect(()=>{
 GetInterviewQuestions();
},[interviewId])
const vapi = useMemo(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY as string), []);

const GetInterviewQuestions=async()=>{
 const result=await convex.query(api.Interview.GetInterviewQuestions,{
 //@ts-ignore 
 interviewRecordId:interviewId,
 
 });
 setInterviewData(result?.[0] as InterviewData);
}

const [isMuted, setIsMuted] = useState(false); 
const handleToggleMute = () => {
 if (!isCallActive) {
 console.warn("Cannot toggle mute: call is not active.");
 return;
 }
 const newMutedState = !isMuted;
 vapi.setMuted(newMutedState);
 setIsMuted(newMutedState);
};

useEffect(()=>{
 interviewData&&startInterviewCall();
},[interviewData])

const startInterviewCall=()=>{
 //@ts-ignore
 const questionList=interviewData?.interviewQuestions.text.map(item => item.question);
 console.log('Question List:',questionList);
 const assistantOptions = {
  name: "AI Recruiter",
  firstMessage: `Hi ${user?.fullName}, 'how are you? Ready for your interview on ${interviewData?.jobTitle}?`,
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
  },
  voice: {
    provider: "playht",
    voiceId: "Jennifer",
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.

You will receive the candidate's emotional tone (e.g., 'calm', 'anxious', 'confused') along with their words. You MUST use this emotional context to be more empathetic and effective as an interviewer.

Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there!"," Welcome to your ${interviewData?.jobTitle} interview. Let's get started with a few questions!"

Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are
the questions ask one by one:
Questions: ${questionList}

If the candidate struggles, offer hints or rephrase the question without giving away the answer. Pay close attention to their tone: if they sound 'anxious' or 'confused', be extra encouraging. Example:
"Need a hint? No worries, you're close! Think about how React tracks component updates!"

Provide brief, encouraging feedback after each answer. Match their energy: if they sound 'happy' or 'confident' with their answer, be more enthusiastic. Example:
"Nice! That's a solid answer. You sounded very confident on that one!"
"Hmm, not quite! Sounds like that one might have stumped you, want to try again?"

Keep the conversation natural and engaging-use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"

After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That's a great! You handled some tough questions well. Keep sharpening your skills!"

End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"

Key Guidelines:
Be friendly, engaging, and witty
Keep responses short and natural, like a real conversation
Adapt based on the candidate's confidence level and emotional tone
Ensure the interview remains focused on React
`.trim(),
      },
    ],
  },
};
//@ts-ignore
vapi.start(assistantOptions);
}
const stopInterview = useCallback(() => {
  vapi.stop();
}, [vapi]);

 useEffect(() => {
  const onCallStart = () => {
   toast('Call Connected...');
   setIsCallActive(true); 
   setIsMuted(vapi.isMuted());
  };
 
  const onCallEnd = () => {
   toast('Call Disonnected...');
   setIsCallActive(false); 
   setIsMuted(false);
   setTimeLeft(15 * 60);
    GenerateFeedback();   
  };

  const onSpeechStart = () => {
   console.log("User started speaking");
   setActiveUser(false);
  };

    // --- THIS IS THE FIX: Removed the stray 'fetc' ---
   const onSpeechEnd = () => {
   console.log("User stopped speaking");
   setActiveUser(true);
  };


  vapi.on("call-start", onCallStart);
  vapi.on("call-end", onCallEnd);
  vapi.on("speech-start", onSpeechStart);
  vapi.on("speech-end", onSpeechEnd);

  return () => {
   vapi.off("call-start", onCallStart);
   vapi.off("call-end", onCallEnd);
   vapi.off("speech-start", onSpeechStart);
   vapi.off("speech-end", onSpeechEnd);
   
   vapi.stop();
  };
 }, [vapi]);

vapi.on('message', (message) => {
  if (message.type === 'conversation-update') {
    conversationRef.current = message.conversation;
    
    console.log("Received message event:", conversationRef.current);

  }
  
});

useEffect(() => {
  if (!isCallActive) {
    return;
  }

  const timerId = setInterval(() => {
    setTimeLeft(prevTime => {
      if (prevTime <= 1) {
        clearInterval(timerId);
        return 0;
      }
      return prevTime - 1;
    });
  }, 1000);
  
  return () => clearInterval(timerId);
}, [isCallActive]);

useEffect(() => {
  if (timeLeft === 0 && isCallActive) {
    toast.warning('Time is up! Ending the interview.');
    stopInterview();
  }
}, [timeLeft, isCallActive, stopInterview]);

const formattedTime = useMemo(() => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}, [timeLeft]);

const GenerateFeedback = async () => {
  toast.warning('Generating AI feedback...');
  const result = await axios.post('/api/ai-feedback', {
    conversation:   conversationRef.current, 
  });
  console.log("Feedback received in browser:", result.data.message.content);
  toast.success('AI Feedback is Ready!');
  const resp=await updateFeedback({
    feedback:result.data.message.content,
    //@ts-ignore
    recordId:interviewId,
  });
  toast.success('Interview Completed Successfully!');
  router.replace('/dashboard');
};


if (!isLoaded) {
 return null; 
}
if (!user || !user.imageUrl) {
 return <div>No Image</div>;
}
 return (
 <div className='flex-col items-center justify-center mt-20 w-full'>
 <div className='ml-25 mr-25 flex justify-between items-center'>
 <div className='font-bold cursor-default'>AI Interview Session</div>
 <div className='flex items-center cursor-default'><Timer/>{formattedTime}</div>
 </div>
 <div className='bg-gray-100 border border-gray-300 rounded-2xl flex flex-col items-center p-6 mt-4 mr-20 ml-20'>
 <div className='flex items-center justify-center w-full mt-20 gap-4'>
 <div className='flex flex-col items-center justify-center w-full'>
 
 <Image 
src={randomImageSrc} 
alt="Interview" 
width={180} 
height={180}
className='rounded-full border border-gray-300 shadow-xl'
/><hr/><div className='flex items-center justify-center gap-2'>
<span className={`h-2 w-2 rounded-full ${!activeUser ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>AI Recruiter
 </div></div>

 <div className='flex flex-col items-center justify-center w-full'>
 
 <Image src={user.imageUrl} alt="Interview" 
 width={180} 
 height={180}
 className='rounded-full border border-gray-300 shadow-xl'
 /><hr/>
 <div className='flex items-center justify-center gap-2'>
 <span className={`h-2 w-2 rounded-full ${activeUser ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>{user?.fullName}
 </div>
 </div>
 </div>
 <div className='mt-10 w-full max-w-100 p-6 bg-white rounded-2xl flex flex-col items-center justify-center gap-8'>
 
 <div className='mt-7 items-center justify-center gap-5 flex'>
    {isMuted ? 
    <MicOff onClick={handleToggleMute} className={'h-12 w-12 p-3 text-white rounded-full bg-gray-600 cursor-pointer transition-colors'}
    /> 
    : 
    <Mic onClick={handleToggleMute} className={'h-12 w-12 p-3 text-white rounded-full bg-gray-500 cursor-pointer transition-colors'}
    />
    }
  
    <AlertConfirmation stopInterview={()=>stopInterview()}><Phone className='h-12 w-12 p-3 bg-red-500 hover:bg-red-700 text-white rounded-full cursor-pointer'/></AlertConfirmation>
 </div>
 <h2 className='text-sm text-gray-500 text-center cursor-default'>Interview in Progress...</h2>
 </div>
 </div>
 </div>
)
}

export default StartInterview