import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { userId } = getAuth(req);

  const publicRoutes = ["/", "/api/webhooks/clerk", "/api/webhooks/stripe"];

  // If the route is public, allow access
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If there's no user ID, redirect to the sign-in page
  if (!userId) {
    return NextResponse.redirect("/sign-in");
  }

  // Allow access to the protected route
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/",
  ],
};
