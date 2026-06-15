import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple middleware that protects admin routes
// Uses a lightweight check instead of next-auth middleware which requires DB
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect admin pages (not login) and admin API routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Check for session token cookie (set by NextAuth)
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value

    if (!sessionToken) {
      // Redirect to login page
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // For admin API routes, just pass through — the API handlers check auth themselves
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}
