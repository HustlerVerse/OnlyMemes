import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/utils";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import type { NextAuthConfig, User as NextAuthUser } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

await connectToDB();

type ExtendedToken = JWT & { id?: string };
type ExtendedSession = Session & {
  user: Session["user"] & { id?: string };
};
type Callbacks = NonNullable<NextAuthConfig["callbacks"]>;
type JWTParams = Parameters<NonNullable<Callbacks["jwt"]>>[0];
type SessionParams = Parameters<NonNullable<Callbacks["session"]>>[0];

export const authOptions: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise), // Assume you add lib/mongodb.ts with MongoClient
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;
        const user = await User.findOne({ email });
        if (!user) return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt(params: JWTParams) {
      const nextToken = params.token as ExtendedToken;
      const user = params.user as AdapterUser | NextAuthUser | null;
      if (user) {
        nextToken.id =
          (user as AdapterUser).id?.toString() ??
          ((user as AdapterUser & { _id?: string })._id ?? "").toString();
      }
      return nextToken;
    },
    async session(params: SessionParams) {
      const nextSession = params.session as ExtendedSession;
      if (nextSession.user) {
        nextSession.user.id = (params.token as ExtendedToken).id;
      }
      return nextSession;
    },
  },
  pages: {
    signIn: "/auth",
  },
};

const { handlers, auth } = NextAuth(authOptions);
export const { GET, POST } = handlers;
export { auth };
