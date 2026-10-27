import { auth } from "@/lib/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    const isLoginPage = pathname === "/login";
    const isAdminPage = pathname.startsWith("/admin");

    if(!isLoggedIn && !isLoginPage) {
        return Response.redirect(new URL("/login", req.nextUrl));
    }

    if(isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/", req.nextUrl));
    }

    if(isAdminPage && req.auth?.user.role !== "ADMIN") {
        return Response.redirect(new URL("/", req.nextUrl));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};