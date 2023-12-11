const getPlaylistByGenre = async (token, genreID) => {
    try {
        const limit = 10;
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreID}/playlists?limit=${limit}&country=NZ`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        const data = await result.json();
        return data.playlists.items;
    } catch (error) {
        console.log(error.response.data)
    }
}

const createPlaylist = async (token, genres, artistName, artistId, firstSong) => {
    let trackURIs = [firstSong];
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
        const tracks = data.tracks.map(track => track.uri);
        trackURIs = trackURIs.concat(tracks);

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

    return playlistData;
}

const findPlaylist = async (token, uri) => {
    try {
        const playlist_id = uri.split(':').pop();
        const result = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        })

        const data = await result.json();
        return data;
    } catch (error) {
        console.log(error.response.data)
    }
}

export { getPlaylistByGenre, createPlaylist, findPlaylist }