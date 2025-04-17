import { useEffect, useState } from 'preact/hooks';
import { getSpotifyUserId } from '../lib';

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_ID;
const REDIRECT_URI = 'http://localhost:5173/'
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';


export const refreshAccessToken = async () => {
  console.log("refreshing")
  const storedRefreshToken = localStorage.getItem('refresh_token');
  if (!storedRefreshToken) {
    console.error('No refresh token found in local storage');
    return;
  }
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: storedRefreshToken,
        client_id: SPOTIFY_CLIENT_ID,
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      // setAccessToken(data.access_token);
      // The refresh token might also be updated in the response
      if (data.refresh_token) {
        localStorage.setItem('access_token', data.access_token);
        // setRefreshToken(data.refresh_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('access_token_issued', String(Date.now()));

      }
    } else {
      console.error('Error refreshing access token:', data);
      if (data.error && data.error_description) {
        console.error(`Spotify Refresh Error: ${data.error} - ${data.error_description}`);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  } catch (error) {
    console.error('Error during access token refresh:', error);
  }
}
export default function SpotifyLoginButton(props: { noTest?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const [checkLogin, setCheckLogin] = useState(isLoggedIn())
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeCodeForToken(code);
    }
    setCheckLogin(isLoggedIn())

  }, []);
  useEffect(() => {
    setCheckLogin(isLoggedIn())
  }, [isLoading])

  const generateCodeVerifier = (length: number) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const generateCodeChallenge = async (codeVerifier: string) => {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
    const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const initiateAuthFlow = async () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    const codeVerifier = generateCodeVerifier(128);
    localStorage.setItem('code_verifier', codeVerifier);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: 'user-read-private user-read-email playlist-modify-public playlist-modify-private',
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });
    setIsLoading(false)
    window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;

  };

  const exchangeCodeForToken = async (code: string) => {
    const storedCodeVerifier = localStorage.getItem('code_verifier');
    if (!storedCodeVerifier) {
      console.error('No code verifier found in local storage');
      return;
    }

    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI, // Double-check this value
          client_id: SPOTIFY_CLIENT_ID,
          code_verifier: storedCodeVerifier, // Ensure this is the correct one
        }),
      });
      const data = await response.json();
      if (data.access_token) {
        if (data.refresh_token) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem('access_token_issued', String(Date.now()));

        }
        localStorage.removeItem('code_verifier');
      } else {
        console.error('Error exchanging code for token:', data);
        if (data.error && data.error_description) {
          console.error(`Spotify Token Error: ${data.error} - ${data.error_description}`);
        }
      }
    } catch (error) {
      console.error('Error during token exchange:', error);
    }
  };
  const testConnection = async () => {
    const spotifyId = await getSpotifyUserId()
    setCheckLogin(spotifyId ? true : false)
  }
  return (
    <div className={"button-group"} style={{ alignItems: "flex-start" }}>
      <div>
        <button className={"green"} onClick={initiateAuthFlow}>
          Login to Connect Spotify
        </button><br />
        <span style={{ fontSize: 12, paddingRight: 5 }}>please login before you begin</span>
      </div>
      {!props.noTest &&
        <div>
          <button onClick={testConnection}>Test Connection</button>
          <br />
          <span style={{ fontSize: 12, paddingRight: 5 }}> {checkLogin ? "connected" : "not connected"}</span>
        </div>
      }
    </div>
  );
}

const isLoggedIn = () => {
  const spotifyAccessTokenIssueDate = localStorage.getItem("access_token")
  const spotifyAccessToken = localStorage.getItem("access_token_issued")
  if (!spotifyAccessTokenIssueDate || !spotifyAccessToken) return false
  const expiredTime = 1000 * 60 * 50 //50 mins
  const isValidToken = Math.abs(Number(spotifyAccessTokenIssueDate) - Date.now()) < expiredTime
  return (spotifyAccessToken && isValidToken) ? true : false
}
