import NextAuth, { NextAuthOptions } from "next-auth"

async function introspect({ client_id,client_secret}, {access_token}) {
  // 
  const options = {
    method: 'POST',
    headers:{
      'Authorization': 'Basic ' + Buffer.from(client_id + ":" + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: new URLSearchParams({
        token: access_token
    })
  };
  // console.log(options);
  const res = await fetch("https://id.tinkoff.ru/auth/introspect", options);
  await checkResponse(res);
 
  const profile = await res.json();
  return profile;
}
async function checkResponse(res) {
  if (!res.ok) {
    const msg = await res.text();
    console.log('error', msg);
    throw new Error(msg);
  }
  return res;
}

async function getProfile({ client_id,client_secret}, {access_token}) {
  const options = {
    method: 'POST',
    headers:{
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: new URLSearchParams({
        client_id,
        client_secret
    })
  };
  // console.log(options);
  const res = await fetch("https://id.tinkoff.ru/userinfo/userinfo", options);
  await checkResponse(res);
 
  const profile = await res.json();
  return profile;
}

async function getPassport({client_id,client_secret}, {access_token}) {
  const options = {
    method: 'GET',
    headers:{
      'Authorization': `Bearer ${access_token}`,
    },    
  };
  console.log(options);
  const url = "https://business.tinkoff.ru/openapi/api/v1/individual/documents/passport";
  const res = await fetch(url, options);
  await checkResponse(res);
  const profile = await res.json();
  return profile;
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    {
      id: "tinkoff",
      name: "Tinkoff",
      type: "oauth",
      // version: "2.0",
      authorization: {
        url: "https://id.tinkoff.ru/auth/authorize",
        params: { response_type: "code",  scope:"" }, // openid profile phone email opensme/individual/passport/get opensme/individual/passport-short/get //scope: "openid profile phone email opensme/individual/passport-short/get" 
      },
      token: {
        url: "https://id.tinkoff.ru/auth/token",
        params: { grant_type: "authorization_code" }
      },
      userinfo: {
        url: "https://id.tinkoff.ru/userinfo/userinfo",
        async request({ client, tokens }) {
          // const into=await introspect(client, tokens);
          // console.log(into);

          // console.log('client!!!', client);
          const profile = await getProfile(client, tokens); 
          console.log(profile);
          // const profile= {};
          const passport = await getPassport(client, tokens);
          profile.passport =passport;
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
      profile.id=profile.sub
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
