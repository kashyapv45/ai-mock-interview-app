import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {

  const { conversation } = await req.json();

  console.log('Received conversation for feedback:', conversation);
  const result= await axios.post('http://localhost:5678/webhook/5bf5b6e5-0031-46d1-815d-617aa3da225d', {

    conversation:JSON.stringify(conversation),

  });
  console.log('sss'+result);

return NextResponse.json(result.data);
}