import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect,

} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/signin"]);
const isProctectedRoute = createRouteMatcher(["/notes(.*)"]);

export default convexAuthNextjsMiddleware(
    async (request, { convexAuth }) => {
        if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
            return nextjsMiddlewareRedirect(request, "/notes")
        }
        if (isProctectedRoute(request) && !(await convexAuth.isAuthenticated())) {
            return nextjsMiddlewareRedirect(request, "/signin")
        }
    },
    {
        cookieConfig: {
            maxAge: 60 * 60 * 24 * 30,
        }
    }
);

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}