import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Wrap NextAuth handler to catch database connection errors gracefully
// This prevents the entire site from crashing when DB is unavailable
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
