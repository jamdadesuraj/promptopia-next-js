import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/utils/database";
import User from "@/models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      try {
        await connectDB();
        const sessionUser = await User.findOne({
          email: session.user.email,
        });

        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        } else {
          console.log(`User with email ${session.user.email} not found`);
        }

        return session;
      } catch (error) {
        console.error("Error fetching user session:", error);
        return session;
      }
    },

    async signIn({ profile }) {
      try {
        await connectDB();

        // Check if user exists
        const userExist = await User.findOne({ email: profile.email });

        // If user doesn't exist, create a new user
        if (!userExist && profile?.email && profile?.name && profile?.picture) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(/\s+/g, "").toLowerCase(), // Replace all spaces
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
