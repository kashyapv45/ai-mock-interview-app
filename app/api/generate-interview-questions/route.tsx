import { aj } from "@/app/utils/arcjet";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req:NextRequest) {
    try{

        const user=await currentUser();
        const formData = await req.formData();

        const file = formData.get('file') as File;
        const jobTitle = formData.get('jobTitle') as string;
        const jobDescription = formData.get('jobDescription') as string; 

        if (!file || !jobTitle || !jobDescription) {
            return NextResponse.json({error:"Missing required fields"}, {status:400});
        }
    
        const decision = await aj.protect(req, { userId:user?.primaryEmailAddress?.emailAddress??'', requested: 5 });
        console.log("Arcjet decision", decision);

        //@ts-ignore
        if(decision?.reason?.remaining==0){
            return NextResponse.json({
                status:429,
                result:'Not enough credits to generate interview questions. Please upgrade your plan or wait for 24 hours for credits to refill.'
            })
        }

        const bytes = await file.arrayBuffer();
        const buffer= Buffer.from(bytes);

        // Created per request because the build runs this file without the keys.
        const imagekit = new ImageKit({
            publicKey : process.env.IMAGEKIT_URL_PUBLIC_KEY!,
            privateKey : process.env.IMAGEKIT_URL_PRIVATE_KEY!,
            urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT!
        });

        const uploadResponse = await imagekit.upload({
            file : buffer,
            fileName : `upload-${Date.now()}.pdf`,
            isPrivateFile: false,
            useUniqueFileName: true,
        });

        const result = await axios.post(process.env.N8N_QUESTIONS_WEBHOOK_URL || 'http://localhost:5678/webhook/0ea96a56-5c11-47c9-ba31-f4c4209b9476',{
            resumeUrl: uploadResponse?.url,
            jobTitle: jobTitle,
            jobDescription: jobDescription
        });

        return NextResponse.json({
            questions: result.data,
            resumeUrl: uploadResponse?.url,
            status: 200
        });

    }catch(e){
        console.log(e);
        return NextResponse.json({error:"Error generating interview questions"}, {status:500});
    }
}