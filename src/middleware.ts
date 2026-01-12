import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/env";

export async function middleware(request: NextRequest) {
  // Create a response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            // Preserve Supabase's cookie options, but ensure secure in production
            const cookieOptions = {
              ...options,
              // Only set secure if not already set and in production
              ...(process.env.NODE_ENV === "production" &&
                options?.secure === undefined && { secure: true }),
            };
            response.cookies.set(name, value, cookieOptions);
          });
        },
      },
    }
  );

  // Get user - this will automatically refresh session if needed
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Log error in production for debugging (remove in production if not needed)
  if (error) {
    console.error("Auth error in middleware:", error.message);
  }

  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forget-password",
    "/reset-password",
  ];
  const authRoutes = ["/auth/callback", "/auth/auth-code-error"];
  const apiRoutes = pathname.startsWith("/api");
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    authRoutes.some((route) => pathname.startsWith(route));

  // If user is not logged in
  if (!user) {
    // Allow access to public routes and API routes
    if (isPublicRoute || apiRoutes) {
      return response;
    }
    // Redirect to home page for all other routes
    // Use the request URL to preserve the correct domain in production
    const url = request.nextUrl.clone();
    url.pathname = "/";
    // url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  // If user is logged in, don't allow access to login/signup pages
  if (pathname === "/login" || pathname === "/signup") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // If user is logged in, allow access to all other routes
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};
