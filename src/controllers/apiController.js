const getToken = async (codeVerifier, code) => {
    const clientID = '4e3f37f14bf7476298ed0d9971c5d92d';
    const redirectUri = import.meta.env.MODE === 'development'
        ? 'http://localhost:5173/mainpage'
        : import.meta.env.VITE_REDIRECT;

    try {
        console.log("AAAAAAAAAAAAAAAAaaaaaa")
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        })

        const data = await res.json();
        return data.access_token;
    } catch (error) {
        console.log(error.response.data)
    }
}

const getGenres = async (token) => {
    try {
        const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        const data = await result.json();
        return data.categories.items;
    } catch (error) {
        console.log(error.response.data)
    }

}

const getPlaylistByGenre = async (token, genreID) => {
    try {
        const limit = 10;
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreID}/playlists?limit=${limit}&country=NZ`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        const data = await result.json();
        //console.log(data.error.message)
        return data.playlists.items;
    } catch (error) {
        console.log(error.response.data)
    }
}

const createPlaylist = async (token, genres, artistName, artistId) => {
    let trackURIs;
    let playlistId;
    let playlistData;
    genres = genres.slice(-4);
    console.log('Artist: ' + artistName)
    try {
        // Step 1: Find recommended songs
        const genresArray = genres.join(',');
        const result = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genresArray}&seed_artists=${artistId}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        const data = await result.json();
        trackURIs = data.tracks.map(track => track.uri);
    } catch (error) {
        console.log(error.response.data)
    }

    try {
        // Step 2: Create a Playlist
        const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `${artistName} Inspired Playlist`,
                description: 'Your Playlist Description',
                public: false, // Set to false if you want a private playlist
            }),
        })

        playlistData = await result.json();
        playlistId = playlistData.id;

    } catch (error) {
        console.log(error.response)
    }

    try {
        // Step 3: Add Tracks to Playlist
        const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uris: trackURIs,
            }),
        });

        if (addTracksResponse.ok) {
            console.log('Tracks added to the playlist successfully.');
        } else {
            console.error('Failed to add tracks to the playlist. Status:', addTracksResponse.status);
            console.log('Response:', await addTracksResponse.json());
        }


    } catch (error) {
        console.log(error.response.data)
    }

    return [playlistData];
}

export { getToken, getGenres, getPlaylistByGenre, createPlaylist }
