const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}
const sha256 = async (plain: string) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}
const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// function base64encode(input: ArrayBuffer) {
//   //@ts-ignore
//   return btoa(String.fromCharCode.apply(null, new Uint8Array(input)))
//     .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
// }



const clientId = '5b43043c64e9475a82d8ae8fc6b7d1b6';
const redirectUri = 'http://localhost:5173/';

const requestSpotifyCode = async () => {
  const codeVerifier: string = generateRandomString(64);
  // // const codeVerifier: string = '4WGCWrEWiQuwDdsAlnEC7k8ND3S9CeVU4ahZpOcmeojyxmsamVP1MAjEyAr5nl4s'
  localStorage.setItem('code_verifier', codeVerifier);

  // const codeVerifier: string | null = localStorage.getItem('code_verifier')
  // const codeVerifier: string = '4WGCWrEWiQuwDdsAlnEC7k8ND3S9CeVU4ahZpOcmeojyxmsamVP1MAjEyAr5nl4s'
  if (!codeVerifier) {
    return { code: null, codeVerifier: null }
  }
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);

  const scope = 'user-read-private user-read-email';
  const authUrl = new URL("https://accounts.spotify.com/authorize")


  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();

  const urlParams = new URLSearchParams(window.location.search);
  return { code: urlParams.get('code'), codeVerifier };

}

export const setSpotifyToken = async () => {
  const url = "https://accounts.spotify.com/api/token";
  const { code, codeVerifier } = await requestSpotifyCode()
  if (!code || !codeVerifier) {
    console.error("no valid code found on session")
    return
  }
  // const codeVerifier = window.localStorage.getItem('code_verifier');
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    } as any),
  }
  try {
    const body = await fetch(url, payload);
    // window.localStorage.setItem("body", JSON.stringify(await body.json()))
    // const textIs = await body.text()

    const response = await body.json();
    localStorage.setItem('access_token', response.access_token);
    if (response.access_token) {
      localStorage.setItem('access_token_issued', String(Date.now()));
    } else {
      localStorage.setItem('access_token_issued', '');
    }
    return

  } catch (error) {
    console.error("unable to sign in currently", error)
    return
  }

}
export const testSpotifyLogin = async () => {
  let spotifyAccessToken = localStorage.getItem('access_token');
  if (!spotifyAccessToken) {
    console.error("no access token")
    return
  }
  await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + spotifyAccessToken
    },
  }).then((res) => {
    console.log(res)
  }).catch(error => {
    console.error(error)
  })
}
