import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Add your email sending logic here using Nodemailer, SendGrid, etc.
  console.log('Contact form submission:', data);
  
  return NextResponse.json({ success: true });
} 