import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  // Allow signed out users to access the specified routes:
  publicRoutes: [
    '/',
    '/events/:id',
    '/api/webhooks/stripe',
    '/api/uploadthing'
  ],
  //These routes won't be 
  //authenticated by clerk
  ignoredRoutes: [
    '/api/webhooks/clerk',
    '/api/webhooks/stripe',
    '/api/uploadthing'
  ]
});
 
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api|trpc)(.*)"
  ]
};