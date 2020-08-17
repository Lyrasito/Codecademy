const fetch = require("node-fetch");
let accessToken;
let userID;
const clientID = "41072e0bd41e4b698ea6f1b44b5bb427";
const redirectURI = "http://localhost:3000/";

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    accessToken = Spotify.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        console.log(jsonResponse)
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview: track.preview_url
        }));
      });
  },

  async getCurrentUserId() {
    if (userID) {
      return;
    }
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: headers,
    });
    const jsonResponse = await response.json();
    userID = jsonResponse.id;
  },

  async savePlaylist(name, trackUris, id) {
    if (!name || !trackUris.length) {
      return;
    }
    accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    await Spotify.getCurrentUserId();
    if (id) {
      return fetch(
        `https://api.spotify.com/v1/users/${userID}/playlists/${id}`,
        {
          headers: headers,
          method: "PUT",
          body: JSON.stringify({ name: name }),
        }
      );
    }
    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ name: name }),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        const playlistId = jsonResponse.id;
        return fetch(
          `https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`,
          {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ uris: trackUris }),
          }
        );
      });
  },

  async getUserPlaylists() {
    accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    await Spotify.getCurrentUserId();

    return fetch("https://api.spotify.com/v1/me/playlists", {
      headers: headers,
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        
        return jsonResponse.items.map((data) => ({
          playlistId: data.id,
          name: data.name,
        }));
      });
  },

  async getPlaylist(id) {
    accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    await Spotify.getCurrentUserId();
    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${id}`, {
      headers: headers,
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        console.log(jsonResponse);
        return {
          name: jsonResponse.name,
          id: jsonResponse.id,
          tracks: jsonResponse.tracks.items.map((data) => ({
            id: data.track.id,
            name: data.track.name,
            artist: data.track.artists[0].name,
            album: data.track.album.name,
            uri: data.track.uri,
          })),
        };
      });
  },
};

Spotify.getUserPlaylists();

export default Spotify;
