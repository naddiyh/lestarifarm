import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_ACCESS: Record<string, string[]> = {
  "super-admin": ["/dashboard", "/monitoring", "/settings", "/user"],
  admin: ["/dashboard", "/monitoring", "/settings"],
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  console.log("=== MIDDLEWARE ===");
  console.log("pathname:", pathname);
  console.log("user:", user?.id ?? "null");

  const isPublicPage =
    pathname.startsWith("/login") || pathname.startsWith("/resetpass");

  // 1. Belum login → redirect ke login
  if (!user && !isPublicPage) {
    console.log("→ redirect to login (not logged in)");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Sudah login + buka /login → redirect ke dashboard
  if (user && pathname.startsWith("/login")) {
    console.log("→ redirect to dashboard (already logged in)");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. Cek role-based access
  if (user) {
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    console.log("userData:", userData);
    console.log("roleError:", roleError?.message);

    const role = userData?.role as string;
    const allowedPaths = ROLE_ACCESS[role] ?? [];

    console.log("role:", role);
    console.log("allowedPaths:", allowedPaths);

    const isProtectedPath = [
      "/dashboard",
      "/monitoring",
      "/settings",
      "/user",
    ].some((p) => pathname.startsWith(p));

    if (isProtectedPath) {
      const isAllowed = allowedPaths.some((p) => pathname.startsWith(p));
      console.log("isAllowed:", isAllowed);
      if (!isAllowed) {
        console.log("→ redirect to dashboard (no access)");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  console.log("→ pass through");
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/monitoring/:path*",
    "/settings/:path*",
    "/user/:path*",
    "/login",
    "/resetpass/:path*",
  ],
};
