import { NextResponse } from 'next/server'

export async function GET() {
  // Redirect to the Google Drive CV link
  return NextResponse.redirect('https://drive.google.com/file/d/10FGYKaOASoCKYoUyLE7sWnKS9NrlTAIR/view?usp=drive_link')
} 