import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains

    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    // }),
    // Auth0Provider({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),
    {
      id: "tinkoff",
      name: "Tinkoff",
      type: "oauth",
      // version: "2.0",
      authorization: {
        url: "https://id.tinkoff.ru/auth/authorize",
        params: { response_type: "code",  scope:"" }, //scope: "openid profile phone email opensme/individual/passport/get" 
      },
      token: {
        url: "https://id.tinkoff.ru/auth/token",
        params: { grant_type: "authorization_code" }
      },
      userinfo: {
        url: "https://id.tinkoff.ru/userinfo/userinfo",
        async request({ client, tokens }) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          //const profile = await client.userinfo(tokens.access_token!)
            const options = {
              method: 'POST',
              headers:{
                'Authorization': `Bearer ${tokens.access_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              },    
              body: new URLSearchParams({
                  'client_id': process.env.TINKOFF_ID,
                  'client_secret': process.env.TINKOFF_SECRET,
              })
            };
            console.log(options, tokens);
            const res = await fetch("https://id.tinkoff.ru/userinfo/userinfo", options);
  
            if (!res.ok) {
              const msg = await res.text();
              console.log('error', res, res.headers, msg);
              throw new Error(msg);
            }
            const profile = await res.json();
            return profile;
          }
      },
      checks: ["pkce", "state"],
      // idToken: true,
      issuer: "https://id.tinkoff.ru/",
      //https://github.com/nextauthjs/next-auth/issues/3559
      client: {
        authorization_signed_response_alg: 'HS256',
        id_token_signed_response_alg: 'HS256'
     },
     async profile(profile, tokens) {
      console.log('profile!!!!', profile)
        // You can use the tokens, in case you want to fetch more profile information
        // For example several OAuth providers do not return email by default.
        // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
        return profile;
      },
      clientId: process.env.TINKOFF_ID,
      clientSecret: process.env.TINKOFF_SECRET

    }
  ],
  theme: {
    colorScheme: "light",
  },
  debug: true,
  callbacks: {
    async jwt({ token }) {
      console.log('debug token:', token);
      token.userRole = "admin"
      return token
    },
  },
  events: {
    async signIn(message) { console.log("signIn", message) },
    async signOut(message) { console.log("signOut", message) },
    async createUser(message) { console.log("createUser", message) },
    async updateUser(message) { console.log("updateUser", message) },
    async linkAccount(message) { console.log("linkAccount", message) },
    async session(message) { console.log("session", message) },
  },
  jwt: {
    // signingKey: {"kty":"oct","kid":"1I83zCTA1TuMrzPT4WXhGgvGSz9lMlqmnSrAVtopdOw","alg":"HS256","k":"Apr34khcVgeQkQd-5_gKZtHE1S2kMF_LVk8YNjTbCSo"},
    // verificationOptions: {
    //   algorithms: ["HS256"]
    // }
  }
}

export default NextAuth(authOptions)
