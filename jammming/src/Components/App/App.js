import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";
import PlaylistList from "../PlaylistList/PlaylistList";

Spotify.getAccessToken();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
      playlists: [],
      playlistId: null,
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
  }
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({
      playlistTracks: tracks,
    });
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter((data) => data.id !== track.id);
    this.setState({
      playlistTracks: tracks,
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name,
    });
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map((track) => track.uri);
    const id = this.state.playlistId;
    Spotify.savePlaylist(this.state.playlistName, trackUris, id).then(() => {
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: [],
        playlistId: null,
      });
    });
  }

  search(term) {
    Spotify.search(term).then((searchResults) => {
      this.setState({ searchResults: searchResults });
    });
  }

  getPlaylists() {
    Spotify.getUserPlaylists().then((playlists) => {
      this.setState({ playlists: playlists });
    });
  }

  selectPlaylist(id) {
    Spotify.getPlaylist(id).then((playlist) => {
      this.setState({
        playlistName: playlist.name,
        playlistTracks: playlist.tracks,
        playlistId: playlist.id,
      });
    });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
          <div className="User-playlists">
            <PlaylistList selectPlaylist={this.selectPlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
