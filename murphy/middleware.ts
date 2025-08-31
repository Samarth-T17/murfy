import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/generate-podcast/:path*",
    "/podcasts/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
