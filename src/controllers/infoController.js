const getSongInfo = async (token, device) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })

        const data = await result.json();
        return data;

    } catch (error) {
        console.log(error.response.data)
    }
}

export { getSongInfo }