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
        const info = await introspect(client, tokens);
        const userinfo = await getUserinfo(client, tokens);
        const addinfo = await getScopesInfo(info.scope, tokens.access_token);
        const profile = Object.assign({}, userinfo, addinfo);
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
    style: {
      logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAxOSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzRfMjA3MjQpIj4KPHBhdGggZD0iTTkuMjU4NTkgMS44MzMzNEM4LjIwMDg4IDEuODMzMzQgNi44ODY3NyAyLjQ4NzA1IDYuMzk3MDIgMi45NDY5OEw2LjU4OTU0IDMuMzg0NDJDNi41ODk1NCAzLjM4NDQyIDUuMDk4MjcgMy40MDQzMiA0LjMyOTYzIDMuODk5MDdDMy41NjA5OSA0LjM5MzgxIDMuMjEwNTEgNC43MzAyOCAyLjgzMTk5IDUuNTI5MzhDMi40NTI5NCA1LjU0NzQzIDEuMDMxNzIgNi4xNTA2OSAwLjIwODY1NCA2Ljc1NzE2QzAuMjA4NjU0IDYuNzU3MTYgLTAuNDgzMTY5IDkuMzc2MDkgMC44MjcxMTggMTAuNTA2MkwwIDExLjY0MThDMC4yMDg2NTQgMTIuMzU2OCAxLjEwOTQ4IDEzLjA4MzMgMi4wMDQ3NCAxMy4xNjk5QzIuNDA3NTYgMTMuNjU4MiAxLjYyNjIyIDE0LjYyNzkgMS42MjYyMiAxNC42Mjc5QzEuOTU2OTkgMTUuNjc3OCA0LjE4MzY5IDE2LjgzMTcgNS41MTM1NyAxNi44MzE3TDUuMzMwNTEgMTcuNDQ5OUM1LjMzMDUxIDE3LjQ0OTkgNi44MTE4IDE4LjUyODUgOS4yMDIyIDE4LjQyNzdDMTEuMjIyOSAxOC40OTMzIDEyLjg2NjQgMTguMDEwNyAxMy4yODM1IDE3LjQ0OTlMMTMuMDcyMyAxNi44MzE3QzE0LjkxOCAxNi41NTY2IDE2LjMxMiAxNS45NTUgMTcuMDg3NiAxNC42Nzc2QzE3LjA4NzYgMTQuNjc3NiAxNi41MSAxMy40NjMzIDE2LjcxMTcgMTMuMTU4N0MxNy42MDY5IDEzLjA3MjEgMTguNDQ0MSAxMi4xOTAzIDE4LjY2NjcgMTEuODA1M0wxNy44NTQ2IDEwLjUyN0MxOC41MDIyIDkuNzk5NTcgMTguODY0NyA3Ljg4MDIxIDE4LjM4ODcgNi43NTcxNkMxNy41NjU2IDYuMTUwNjkgMTYuMTU4MyA1LjY1NzUyIDE1Ljc3OTMgNS42Mzk0N0MxNS42Mjg5IDQuNzUyMiAxNC42NjM0IDQuMDU4NTMgMTQuNjYzNCA0LjA1ODUzQzEzLjc0OTEgMy4yNjMzOSAxMi4wODYxIDMuMzg0NDIgMTIuMDg2MSAzLjM4NDQyTDEyLjIyMTMgMi45NDY5OEMxMS43OTczIDIuNDc0MzcgMTAuNDU4NyAxLjgzMzM0IDkuMjU4NTkgMS44MzMzNFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik02Ljc5MTg5IDQuMzE2OTFDNS43MzM1OSA0LjA0NzM4IDQuOTM1NzcgNC40MTYyNiA0LjI0NTQ5IDQuOTIzODJDMy41NTM4IDUuNDMyNDIgMy4yODA4NSA2LjA5MTcgMy4zNDE1NCA2LjMyNzcyQzIuNzc1OTEgNi4wOTYxNCAxLjUzNDAyIDYuODE0MyAwLjk0Mjg3NyA3LjE1ODgzQzAuOTQyODc3IDcuMTU4ODMgMC40ODU0MTcgOS4zOTY1IDEuNjU0ODUgMTAuMjYyM0MxLjU5NDA2IDEwLjg3MDMgMS4xNjUyOCAxMS41OTk4IDAuOTQyODc3IDExLjczNjVDMS4zMjgzNyAxMi4zNDQ0IDIuMTQ1MjMgMTIuNTEwOCAyLjQ5MTE4IDEyLjM1NjRDMy4wNjk0MyAxMy4xNTcgMi43OTAwMiAxNC4yNDE4IDIuNDY4NzggMTQuNTg3OEMzLjM2NzUgMTUuMzk5MyA1LjUxMTgxIDE1LjczOTYgNi4xMzk4OSAxNS43OTA0QzYuMTM5ODkgMTUuNzkwNCA1LjU4NzAxIDE0LjQ5NDYgNS4zNDAxNiAxMy40MjY5QzQuNjU3OTIgMTAuNDc1OSA1LjAyNTEzIDYuNzkzNzQgNS4wMjUxMyA2Ljc5Mzc0QzUuMDI1MTMgNi43OTM3NCAzLjQzMTQ5IDguNjQ4OTEgNC4zMTk4MiAxMy4xMjEzQzQuNDY5ODEgMTMuODc2NSA0LjY4MTc5IDE0LjY3NDcgNC42ODE3OSAxNC42NzQ3QzQuNTMzOTcgMTQuNjAxNCA0LjE3MzI4IDE0LjY0NTkgMy41MTAwNiAxNC4zMTA0QzMuNzk0MTcgMTQuMDA0NCAzLjY3MTk5IDEyLjE4OTYgMi44MzQ5NSAxMS4yOTkyQzIuODM0OTUgMTEuMjk5MiAyLjQzNjY5IDExLjQ4MyAyLjE0NDMzIDExLjM2MTNDMi4zNDEwMiAxMS4yNDA0IDIuNTg2NjQgMTAuNDY5MyAyLjU4NjY0IDkuODc5MTZDMS42NDAxNSA5LjMxMzQ0IDEuNzQwNTYgOC4yOTA3NSAxLjc4NzM4IDcuNzUyOTdDMi4yNTE4MiA3LjQ1MTQyIDMuMDg0NzYgNi45Mzg4IDQuMTMyNzkgNy4zODYzNEM0LjEwNTI2IDcuMTMyNSA0LjE3Njk1IDYuNDU2ODggNC40NjQ1MSA1Ljk4Mzc0QzQuNDY0NTEgNS45ODM3NCA0LjgxNDU2IDUuMzc0NyA1LjYwNTIgNS4xODM2M0M2LjM5NTg0IDQuOTkyNTYgNi43OTE4OSA0LjMxNjkxIDYuNzkxODkgNC4zMTY5MVoiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTExLjg3NDEgNC4zMTY5MUMxMi45MzI0IDQuMDQ3MzggMTMuNzMwMiA0LjQxNjI2IDE0LjQyMDUgNC45MjM4MkMxNS4xMTIyIDUuNDMyNDIgMTUuMzg1MiA2LjA5MTcgMTUuMzI0NSA2LjMyNzcyQzE1Ljg5MDEgNi4wOTYxNCAxNy4xMzIgNi44MTQzIDE3LjcyMzEgNy4xNTg4M0MxNy43MjMxIDcuMTU4ODMgMTguMTgwNiA5LjM5NjUgMTcuMDExMiAxMC4yNjIzQzE3LjA3MiAxMC44NzAzIDE3LjUwMDcgMTEuNTk5OCAxNy43MjMxIDExLjczNjVDMTcuMzM3NiAxMi4zNDQ0IDE2LjUyMDggMTIuNTEwOCAxNi4xNzQ4IDEyLjM1NjRDMTUuNTk2NiAxMy4xNTcgMTUuODc2IDE0LjI0MTggMTYuMTk3MiAxNC41ODc4QzE1LjI5ODUgMTUuMzk5MyAxMy4xNTQyIDE1LjczOTYgMTIuNTI2MSAxNS43OTA0QzEyLjUyNjEgMTUuNzkwNCAxMy4wNzkgMTQuNDk0NiAxMy4zMjU5IDEzLjQyNjlDMTQuMDA4MSAxMC40NzU5IDEzLjY0MDkgNi43OTM3NCAxMy42NDA5IDYuNzkzNzRDMTMuNjQwOSA2Ljc5Mzc0IDE1LjIzNDUgOC42NDg5MSAxNC4zNDYyIDEzLjEyMTNDMTQuMTk2MiAxMy44NzY1IDEzLjk4NDIgMTQuNjc0NyAxMy45ODQyIDE0LjY3NDdDMTQuMTMyIDE0LjYwMTQgMTQuNDkyNyAxNC42NDU5IDE1LjE1NiAxNC4zMTA0QzE0Ljg3MTggMTQuMDA0NCAxNC45OTQgMTIuMTg5NiAxNS44MzExIDExLjI5OTJDMTUuODMxMSAxMS4yOTkyIDE2LjIyOTMgMTEuNDgzIDE2LjUyMTcgMTEuMzYxM0MxNi4zMjUgMTEuMjQwNCAxNi4wNzk0IDEwLjQ2OTMgMTYuMDc5NCA5Ljg3OTE2QzE3LjAyNTkgOS4zMTM0NCAxNi45MjU1IDguMjkwNzUgMTYuODc4NiA3Ljc1Mjk3QzE2LjQxNDIgNy40NTE0MiAxNS41ODEzIDYuOTM4OCAxNC41MzMyIDcuMzg2MzRDMTQuNTYwOCA3LjEzMjUgMTQuNDg5MSA2LjQ1Njg4IDE0LjIwMTUgNS45ODM3NEMxNC4yMDE1IDUuOTgzNzQgMTMuODUxNSA1LjM3NDcgMTMuMDYwOCA1LjE4MzYzQzEyLjI3MDIgNC45OTI1NiAxMS44NzQxIDQuMzE2OTEgMTEuODc0MSA0LjMxNjkxWiIgZmlsbD0iIzMzMzMzMyIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTkuNDE5NDUgNi4wNDA4NUM4LjY1NzQ0IDYuMDM4MTEgNy42NTExNyA2LjI0MDkxIDcuNjUxMTcgNi4yNDA5MUw3LjM0ODg4IDMuMjMxMzJMOS4zODMwOCAyLjYxNjQ5TDExLjMxNzIgMy4yMzEzMkwxMS4xNTE2IDYuMjQwOTFDMTEuMTUxNiA2LjI0MDkxIDEwLjE2ODkgNi4wNDM1NCA5LjQxOTQ1IDYuMDQwODVaTTkuNDE5NDUgNS4xODI5NEM4Ljk5Njk1IDUuMTcxODMgOC40NTMxMyA1LjI0ODA0IDguNDUzMTMgNS4yNDgwNEw4LjMyODgzIDMuODIyMTFMOS4zODMwOCAzLjUzNjIyTDEwLjQyOTUgMy44MjIxMVY1LjI0ODA0QzEwLjQyOTUgNS4yNDgwNCA5Ljg1MDc2IDUuMTk0MjggOS40MTk0NSA1LjE4Mjk0WiIgZmlsbD0iIzMzMzMzMyIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTkuMzIyNzYgMTcuNDc3N0MxMS4wODM2IDE3LjQ1NzIgMTIuMjEwOCAxNi45MzI2IDEyLjIxMDggMTYuOTMyNkwxMS41MjI0IDE0Ljc2OTlDMTEuNTIyNCAxNC43Njk5IDEwLjA0NSAxNS4xOTgxIDkuMzMzMjggMTUuMTk4OEM4LjYyMTYyIDE1LjE5ODEgNy4xNjc2NSAxNC43Njk5IDcuMTY3NjUgMTQuNzY5OUw2LjQ1NTgxIDE2LjkzMjZDNi40NTU4MSAxNi45MzI2IDcuNTYxOTMgMTcuNDU3MiA5LjMyMjc2IDE3LjQ3NzdaTTkuMzMzMjggMTYuNzU2QzEwLjMzNTkgMTYuNzUyIDEwLjk1NTMgMTYuNTQ2MyAxMS4yOTE1IDE2LjQxTDExLjEwNzQgMTUuNjY4N0MxMC42OTI0IDE1LjgwNSA5Ljk3MjQ3IDE1Ljk1NTUgOS4zMzMyOCAxNS45NjA5QzguNjk0MSAxNS45NTU1IDcuOTY5NzQgMTUuODQzMyA3LjU1NDc1IDE1LjcwN0w3LjM5NDQ3IDE2LjQxQzcuNzMwNjIgMTYuNTQ2MyA4LjMzMDcxIDE2Ljc1MiA5LjMzMzI4IDE2Ljc1NloiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi44OTc1IDcuMTg4ODdINS43Njg4QzUuODI0MDYgNy4yNjU4OSA2LjA0ODc0IDcuNjM5OTUgNi4xMjkxIDcuODU1NzhDNi4yMDk3MSA4LjA3MjI5IDYuMjY5MDYgOC4yOTA2OSA2LjI3MTc3IDguNDI1M0M2LjI3MzkyIDguNTMxODggNi4yODY5IDguODYyNzQgNi4zMDM4NiA5LjI5NTIyTDYuMzA0MDMgOS4yOTk0NUM2LjMzNzY3IDEwLjE1NzEgNi4zODcxMSAxMS40MTc5IDYuNDAxMDMgMTIuMTYyN0M2LjQwNzE2IDEyLjQ5MTIgNi40ODAxNiAxMi45MjY4IDYuNzQzNzMgMTMuMjgzQzcuMDEyMDcgMTMuNjQ1NiA3LjQ2NTMyIDEzLjkwODkgOC4xOTM5OCAxMy45MDg5SDguNzA2NDhDOC43NTcwNiAxMy45MDg5IDguNzkxOTEgMTMuOTIxOSA4LjgxOTUxIDEzLjk0MDlDOC44NDg5NCAxMy45NjExIDguODc2MTQgMTMuOTkyMyA4LjkwMzQyIDE0LjAzNjhDOC45MzEwMSAxNC4wODE5IDguOTU5NjkgMTQuMTQ0OSA4Ljk4NjQgMTQuMjA0N0M5LjAxMDcxIDE0LjI1OTIgOS4wMzc4OSAxNC4zMjAyIDkuMDcwMDIgMTQuMzc1NEM5LjA4MDkzIDE0LjM5MDEgOS4xMjUgMTQuNDQ5IDkuMTY2MTggMTQuNDc1M0M5LjIxMDEyIDE0LjUwMzQgOS4yNjUxNiAxNC41MTk5IDkuMzMzMTYgMTQuNTE5OUM5LjQwMjUzIDE0LjUxOTkgOS40NTgyNSAxNC41MDI3IDkuNTAyNDkgMTQuNDc1NUM5LjU0NDExIDE0LjQ0OTggOS41ODU4MyAxNC4zODk5IDkuNTk3NTUgMTQuMzc1NEM5LjYzMDc1IDE0LjMxODMgOS42NjQwMiAxNC4yNTU0IDkuNjg4MjkgMTQuMTk5NkM5LjcxNDQ2IDE0LjEzOTUgOS43NDAzOCAxNC4wODA3IDkuNzY3MjIgMTQuMDM1NkM5Ljc5MzcyIDEzLjk5MTEgOS44MjAwNiAxMy45NjAzIDkuODQ4NTggMTMuOTQwNUM5Ljg3NTIgMTMuOTIxOSA5LjkwOTMgMTMuOTA4OSA5Ljk1OTgyIDEzLjkwODlIMTAuNDcyM0MxMS4yMDEgMTMuOTA4OSAxMS42NTQyIDEzLjY0NTYgMTEuOTIyNiAxMy4yODNDMTIuMTg2MSAxMi45MjY4IDEyLjI1OTEgMTIuNDkxMiAxMi4yNjUzIDEyLjE2MjdDMTIuMjc5MiAxMS40MTc5IDEyLjMyODYgMTAuMTU3MiAxMi4zNjIzIDkuMjk5NTdMMTIuMzYyNCA5LjI5NTYxQzEyLjM3OTQgOC44NjMgMTIuMzkyNCA4LjUzMTkgMTIuMzk0NSA4LjQyNTNDMTIuMzk3MiA4LjI5MDcgMTIuNDU2NiA4LjA3MjMgMTIuNTM3MiA3Ljg1NTc4QzEyLjYxNzYgNy42Mzk5NSAxMi44NDIzIDcuMjY1ODkgMTIuODk3NSA3LjE4ODg3Wk03LjEyNTU5IDguMTk4MjlDNy4xMTcxIDguMTUyNSA3LjEwNzg4IDguMTA3ODQgNy4wOTgzNCA4LjA2NzRIMTEuNTg4MUMxMS41NzU1IDguMTEyMDkgMTEuNTY2NiA4LjE1NjkyIDExLjU2MDEgOC4xOTkwM0MxMS41NDQxIDguMzAzMyAxMS41NDEyIDguNDcwOTkgMTEuNTQxMiA4LjQ3MDk5QzExLjUwNjMgOS4zNDgyOCAxMS40MzYyIDExLjE3NTIgMTEuNDM2MiAxMi4wODRDMTEuNDM2MiAxMi40NTkgMTEuMzE1MiAxMi43MDE0IDExLjE1NTQgMTIuODQ5QzEwLjk5MzYgMTIuOTk4NSAxMC43OCAxMy4wNjIgMTAuNTc3IDEzLjA1NTZDMTAuNTQ5OSAxMy4wNTQ3IDEwLjQ5NTcgMTMuMDUzOCAxMC40MzggMTMuMDUyOEMxMC4zNjA2IDEzLjA1MTYgMTAuMjc2OSAxMy4wNTAyIDEwLjI0MzMgMTMuMDQ4NkMxMC4wMzkgMTMuMDM5MyA5Ljg0MDU0IDEzLjA0ODUgOS42Njc5NSAxMy4wOTU5QzkuNTQyNzMgMTMuMTMwMyA5LjQyNzggMTMuMTg1OSA5LjMzNDc3IDEzLjI3MTRDOS4xMTcwOSAxMy4wNTY1IDguNzY2MDMgMTIuOTYxOCA4LjQwNjY5IDEyLjk3ODJDOC4zNzMxNiAxMi45Nzk3IDguMjgwODQgMTIuOTgxMSA4LjE5NTE5IDEyLjk4MjNDOC4xMjkxMSAxMi45ODMzIDguMDY3IDEyLjk4NDIgOC4wMzg5MiAxMi45ODUxQzcuNjU3MTMgMTIuOTk3MiA3LjI3MDcgMTIuNjgxMSA3LjI3MDcgMTIuMDg0QzcuMjcwNyAxMS4wOTEzIDcuMjA2MjMgOS40MjQ5NyA3LjE3MzE0IDguNTY5ODRDNy4xNzMxNCA4LjU2OTg0IDcuMTQ5MjcgOC4zMjYxMiA3LjEyNTU5IDguMTk4MjlaIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik03LjA4ODEzIDguMDY3NDFDNy4wOTc2OCA4LjEwNzg2IDcuMTA2OSA4LjE1MjUyIDcuMTE1MzggOC4xOTgzQzcuMTM5MDcgOC4zMjYxNCA3LjE2Mjk0IDguNTY5ODUgNy4xNjI5NCA4LjU2OTg1QzcuMTk2MDMgOS40MjQ5OSA3LjI2MDUgMTEuMDkxNCA3LjI2MDUgMTIuMDg0MUM3LjI2MDUgMTIuNjgxMSA3LjY0NjkyIDEyLjk5NzIgOC4wMjg3MiAxMi45ODUxQzguMDU2OCAxMi45ODQyIDguMTE4OTEgMTIuOTgzMyA4LjE4NDk5IDEyLjk4MjNDOC4yNzA2NCAxMi45ODExIDguMzYyOTYgMTIuOTc5NyA4LjM5NjQ5IDEyLjk3ODJDOC43NTU4MyAxMi45NjE4IDkuMTA2ODkgMTMuMDU2NSA5LjMyNDU3IDEzLjI3MTRDOS40MTc2IDEzLjE4NTkgOS41MzI1MyAxMy4xMzAzIDkuNjU3NzUgMTMuMDk1OUM5LjgzMDM0IDEzLjA0ODUgMTAuMDI4OCAxMy4wMzkzIDEwLjIzMzEgMTMuMDQ4NkMxMC4yNjY3IDEzLjA1MDIgMTAuMzUwNCAxMy4wNTE2IDEwLjQyNzggMTMuMDUyOUMxMC40ODU1IDEzLjA1MzggMTAuNTM5NyAxMy4wNTQ3IDEwLjU2NjggMTMuMDU1NkMxMC43Njk4IDEzLjA2MiAxMC45ODM0IDEyLjk5ODUgMTEuMTQ1MiAxMi44NDkxQzExLjMwNSAxMi43MDE0IDExLjQyNiAxMi40NTkgMTEuNDI2IDEyLjA4NDFDMTEuNDI2IDExLjE3NTIgMTEuNDk2MSA5LjM0ODI5IDExLjUzMSA4LjQ3MUMxMS41MzEgOC40NzEgMTEuNTMzOSA4LjMwMzMxIDExLjU0OTkgOC4xOTkwNEMxMS41NTY0IDguMTU2OTQgMTEuNTY1MyA4LjExMjEgMTEuNTc3OSA4LjA2NzQxSDcuMDg4MTNaIiBmaWxsPSIjRkZERDJEIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfNF8yMDcyNCI+CjxyZWN0IHdpZHRoPSIxOC42NjY3IiBoZWlnaHQ9IjE4LjY2NjciIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIDAuNjY2NjU2KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=",
    },
    options,
  };
}

const scopeSettings = {
  "opensme/individual/passport/get": {
    url: "https://business.tinkoff.ru/openapi/api/v1/individual/documents/passport",
    key: "passport",
  },
  "opensme/individual/inn/get": {
    url: "https://business.tinkoff.ru/openapi/api/v1/individual/documents/inn",
  },
  "opensme/individual/snils/get": {
    url: "https://business.tinkoff.ru/openapi/api/v1/individual/documents/snils"
  },
  "opensme/individual/addresses/get": {
    url: "https://business.tinkoff.ru/openapi/api/v1/individual/addresses",
  },
  "opensme/individual/self-employed/status/get": {
    url: "https://business.tinkoff.ru/openapi/api/v1/individual/self-employed/status"
  }
};

async function getScopesInfo(scopes, access_token) {
  const result = {};
  for (const scope of scopes) {
    if (scopeSettings[scope]) {
      const settings = scopeSettings[scope];
      const data = await getInfo(settings.url, access_token);
      if (settings.key) {
        result[settings.key] = data;
      } else {
        for (const key in data) {
          result[key] = data[key];
        }
      }
    }
  }
  return result;
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
 * get passport/inn/snils/etc info
 * @param {*} access_token
 * @returns
 */
async function getInfo(url, access_token) {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };
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
