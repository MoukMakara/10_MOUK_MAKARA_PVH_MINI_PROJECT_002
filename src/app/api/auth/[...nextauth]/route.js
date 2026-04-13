import NextAuth from "next-auth";
import { loginService } from "../../../../service/auth/login.service";
import CredentialsProvider from "next-auth/providers/credentials";

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};

export const authOption = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(data) {
        try {
          const userData = {
            email: data?.email,
            password: data?.password,
          };
          console.log("Login attempt with email:", userData.email);

          const userInfo = await loginService(userData);
          console.log("Backend response:", JSON.stringify(userInfo, null, 2));
          console.log(
            "Status value:",
            userInfo?.status,
            "Type:",
            typeof userInfo?.status,
          );

          const statusStr = String(userInfo?.status || "");
          if (!statusStr.includes("200")) {
            console.error(
              "Login failed. Status:",
              userInfo?.status,
              "Message:",
              userInfo?.message,
            );
            throw new Error(userInfo?.message || "Invalid credentials");
          }

          const { token } = userInfo?.payload || {};
          if (!token) {
            throw new Error("No token received from server");
          }

          const decodedToken = decodeToken(token);
          if (!decodedToken) {
            console.error("Failed to decode token");
            throw new Error("Failed to decode token");
          }

          console.log("Login successful. Email:", decodedToken.sub);
          return {
            email: decodedToken.sub,
            token: token,
          };
        } catch (error) {
          console.error("Authorization error:", error?.message);
          throw new Error(error?.message || "Authorization failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },

  // custome login page
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
