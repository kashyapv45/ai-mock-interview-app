import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const SaveInterviewQuestion=mutation({
    args:{
        questions:v.any(),
        resumeUrl:v.union(v.string(),v.null()),
        userId:v.id("UserTable"),
        jobTitle:v.union(v.string(),v.null()),
        jobDescription:v.union(v.string(),v.null()),
    },
    handler:async(ctx, args)=>{
        const result=await ctx.db.insert("InterviewSession",{
            interviewQuestions:args.questions,
            resumeUrl:args.resumeUrl,
            userId:args.userId,
            status:"draft",
            jobTitle:args.jobTitle,
            jobDescription:args.jobDescription,
        });
        return result;
    }
})


export const GetInterviewQuestions=query({
    args:{
    interviewRecordId:v.id("InterviewSession"),

    },
    handler:async(ctx, args)=>{
        const result=await ctx.db.query("InterviewSession").filter(q=>q.eq(q.field('_id'),args.interviewRecordId)).collect();
        return result;
    }
})


export const UpdateFeedback=mutation({
    args:{
        recordId:v.id("InterviewSession"),
        feedback:v.any(),
    },
    handler:async(ctx, args)=>{
        const result=await ctx.db.patch(args.recordId,{
            feedback:args.feedback,
            status:"completed",
        })
        return result;
    }
})


export const GetUserInterviews=query({
    args:{
        uid:v.id("UserTable"),
    },
    handler:async(ctx, args)=>{
        const result=await ctx.db.query("InterviewSession")
        .filter(q=>q.eq(q.field('userId'),args.uid))
        .order('desc')
        .collect();
        return result;
    }
})