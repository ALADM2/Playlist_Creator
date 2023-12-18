export const getAuth = async () => {

    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        console.log(import.meta.env.MODE)
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    const sha256 = async (plain) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
    }

    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    const requestAuth = (codeVerifier, codeChallenge) => {
        const clientId = '4e3f37f14bf7476298ed0d9971c5d92d';

        const redirectUri = import.meta.env.MODE === 'development'
            ? 'http://localhost:5173/mainpage'
            : import.meta.env.VITE_REDIRECT;

        const scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state user-read-currently-playing playlist-modify-private playlist-modify-public';
        const authUrl = new URL("https://accounts.spotify.com/authorize")

        // generated in the previous step
        window.localStorage.setItem('code_verifier', codeVerifier);

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
    }

    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);
    console.log(codeVerifier)
    requestAuth(codeVerifier, codeChallenge);
}
