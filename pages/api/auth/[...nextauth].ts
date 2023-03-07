import TinkoffProvider from "./tinkoff.js";
import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    TinkoffProvider({
      clientId: process.env.TINKOFF_ID,
      clientSecret: process.env.TINKOFF_SECRET,
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  debug: true,
  callbacks: {
    // async jwt({ token }) {
    //   console.log("debug token:", token);
    //   return token;
    // },
  },
  events: {
    // async signIn(message) {
    //   console.log("signIn", message);
    // },
    // async signOut(message) {
    //   console.log("signOut", message);
    // },
    // async createUser(message) {
    //   console.log("createUser", message);
    // },
    // async updateUser(message) {
    //   console.log("updateUser", message);
    // },
    // async linkAccount(message) {
    //   console.log("linkAccount", message);
    // },
    // async session(message) {
    //   console.log("session", message);
    // },
  },
  jwt: {
  },
};

export default NextAuth(authOptions);
