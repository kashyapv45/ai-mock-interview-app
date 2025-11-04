import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { data } from "motion/react-client";

export const CreateNewUser=mutation({
    args:{
        name:v.string(),
        email:v.string(),
        imageUrl:v.string()
    },
    handler:async(ctx,args)=>{
        // If User already exists, return existing user
        const user=await ctx.db.query('UserTable').filter(
            q=>q.eq(q.field("email"),args.email)).collect();

        //If User not exists, Insert new user to DB
        if(user?.length==0){
            const data={
                email:args.email,
                name:args.name,
                imageUrl:args?.imageUrl
            }
            const result=await ctx.db.insert("UserTable",{
                ...data,
            });
            return {
                ...data,
                result
                //_id:result
            }
        }
        return user[0];
    }
})