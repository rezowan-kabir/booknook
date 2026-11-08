import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    const user = session?.user
   
    if(!user){

        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set(
            'callbackUrl',
            `${request.nextUrl.pathname}${request.nextUrl.search}`,
        )
        return NextResponse.redirect(loginUrl)
    }
}

export const config = {
  matcher: ["/add-book","/my-books","/my-borrows","/profile","/all-books/:path"],
}