import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/firebase";

const client = new MongoClient(process.env.MONGODB_URI as string);

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          const { db } = await connectDB();
          const users = db.collection("users");

          if (credentials.isSignUp === "true") {
            // Sign up logic
            if (!credentials.username) {
              throw new Error("Username is required for sign up");
            }

            // Check if user already exists
            const existingUser = await users.findOne({
              $or: [
                { email: credentials.email },
                { username: credentials.username }
              ]
            });

            if (existingUser) {
              throw new Error("User already exists with this email or username");
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(credentials.password, 12);

            // Create new user
            const result = await users.insertOne({
              email: credentials.email,
              username: credentials.username,
              password: hashedPassword,
              createdAt: new Date(),
              emailVerified: null,
            });

            return {
              id: result.insertedId.toString(),
              email: credentials.email,
              name: credentials.username,
              username: credentials.username,
            };
          } else {
            // Sign in logic
            const user = await users.findOne({
              $or: [
                { email: credentials.email },
                { username: credentials.email } // Allow login with username or email
              ]
            });

            if (!user) {
              throw new Error("No user found with this email or username");
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

            if (!isPasswordValid) {
              throw new Error("Invalid password");
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.username,
              username: user.username,
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
  interface User {
    username?: string;
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
  }
}
