export default function TinkoffProvider(options) {
  return {
    id: "tinkoff",
    name: "Tinkoff",
    type: "oauth",
    // version: "2.0",
    authorization: {
      url: "https://id.tinkoff.ru/auth/authorize",
      params: { response_type: "code", scope: "" }, // openid profile phone email opensme/individual/passport/get opensme/individual/passport-short/get //scope: "openid profile phone email opensme/individual/passport-short/get"
    },
    token: {
      url: "https://id.tinkoff.ru/auth/token",
      params: { grant_type: "authorization_code" },
    },
    userinfo: {
      async request({ client, tokens }) {
        // const info=await introspect(client, tokens);
        // console.log(info);
        const profile = await getUserinfo(client, tokens);
        // console.log(profile);
        const passport = await getPassport(tokens.access_token);
        profile.passport = passport;
        return profile;
      },
    },
    checks: ["pkce", "state"],
    // idToken: true,
    issuer: "https://id.tinkoff.ru/",
    //https://github.com/nextauthjs/next-auth/issues/3559
    client: {
      authorization_signed_response_alg: "HS256",
      id_token_signed_response_alg: "HS256",
    },
    async profile(profile, tokens) {
      profile.id = profile.sub;
      // You can use the tokens, in case you want to fetch more profile information
      // For example several OAuth providers do not return email by default.
      // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
      return profile;
    },
    options,
  };
}

async function introspect({ client_id, client_secret }, { access_token }) {
  const options = {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      token: access_token,
    }),
  };
  const res = await fetch("https://id.tinkoff.ru/auth/introspect", options);
  await checkResponse(res);

  const info = await res.json();
  return info;
}

async function getUserinfo({ client_id, client_secret }, { access_token }) {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id,
      client_secret,
    }),
  };
  const res = await fetch("https://id.tinkoff.ru/userinfo/userinfo", options);
  await checkResponse(res);

  const userinfo = await res.json();
  return userinfo;
}

/**
 * get passport info
 * @param {*} access_token
 * @returns
 */
async function getPassport(access_token) {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
  ("https://business.tinkoff.ru/openapi/api/v1/individual/documents/passport");
  const res = await fetch(url, options);
  await checkResponse(res);
  const passport = await res.json();
  return passport;
}

/**
 * throws error if response is not ok
 * @param {*} res result of fetch
 * @returns result of fetch
 */
async function checkResponse(res) {
  if (!res.ok) {
    const msg = await res.text();
    console.log("error", msg);
    throw new Error(msg);
  }
  return res;
}
