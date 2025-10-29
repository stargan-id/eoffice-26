import { auth } from "@/auth";
import {
  DEFAULT_ROUTE_AFTER_LOGIN,
  isLoginRoute,
  isPublicRoute,
} from "@/route-with-sub";
import { NextResponse } from "next/server";
export const middleware = auth(async (req) => {
  try {
    console.log("[MIDDLEWARE] time", Date.now());
    console.log("[MIDDLEWARE] req.url", req.url);
    const { nextUrl } = req;
    const session = req.auth;
    const isLoggedIn = !!session;

    console.log("[MIDDLEWARE] user: ", session);
    console.log("[MIDDLEWARE] trying access to url:", nextUrl.pathname);

    if (isLoggedIn && isLoginRoute(nextUrl.pathname)) {
      return Response.redirect(new URL(DEFAULT_ROUTE_AFTER_LOGIN, nextUrl));
    }

    if (!isLoggedIn && isLoginRoute(nextUrl.pathname)) {
      console.log("[MIDDLEWARE] login page");
      return;
    }

    // Allow public routes for everyone
    if (isPublicRoute(nextUrl.pathname)) {
      console.log("[MIDDLEWARE] public route");
      return;
    }

    if (isLoggedIn && !isLoginRoute(nextUrl.pathname)) {
      console.log("[MIDDLEWARE] logged in");
      return;
    }

    console.log("[MIDDLEWARE] session", session);

    if (
      !isLoggedIn &&
      !isLoginRoute(nextUrl.pathname) &&
      !isPublicRoute(nextUrl.pathname)
    ) {
      console.log("[MIDDLEWARE] not logged in");
      const response = NextResponse.redirect(new URL("/login", req.url));
      return response;
    }

    return;
  } catch (error) {
    console.error("[MIDDLEWARE] Unexpected error:", error);
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("authjs.csrf-token", "", { maxAge: 0 });
    response.cookies.set("__Secure-authjs.csrf-token", "", { maxAge: 0 });
    response.cookies.set("authjs.session-token", "", { maxAge: 0 });
    response.cookies.set("__Secure-authjs.session-token", "", {
      maxAge: 0,
    });
    return response;
  }
  return;
});

export const config = {
  matcher: [
    // Only match non-API routes for authentication
    "/((?!.+\\.[\\w]+$|_next|api/|api/auth|trpc).*)",
  ],
};

export default middleware;
