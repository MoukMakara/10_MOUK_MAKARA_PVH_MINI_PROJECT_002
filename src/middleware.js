import { withAuth } from "next-auth/middleware";

export const middleware = withAuth(function middleware(req) {
  return null;
});

export const config = {
  matcher: ["/checkout", "/orders", "/products"],
};
