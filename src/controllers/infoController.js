const getSongInfo = async (token) => {
    try {
        const result = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
        const data = await result.json();

        if(result.ok){
            return data;
        } else {
            return data.error.message;
        }

    } catch (error) {
        console.log(error)
    }
}

export { getSongInfo }