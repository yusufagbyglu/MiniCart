import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Add authentication logic here
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/dashboard/:path*',
        '/checkout/:path*',
    ],
}
