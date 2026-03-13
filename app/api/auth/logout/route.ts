import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  
  // Delete the session cookie
  cookieStore.delete('session')
  
  return NextResponse.redirect(new URL('/admin/login', request.url))
}
