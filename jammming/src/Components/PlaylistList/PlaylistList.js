import React from "react";
import "./PlaylistList.css";
import Spotify from "../../util/Spotify";
import PlaylistListItem from "../PlaylistListItem/PlaylistListItem";

class PlaylistList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
    };
  }
  componentWillMount() {
    Spotify.getUserPlaylists().then((playlists) => {
      this.setState({
        playlists: playlists,
      });
    });
  }

  render() {
    return (
      <div className="PlaylistList">
        <h1>Local Playlists</h1>
        {this.state.playlists.map((data) => {
          return (
            <PlaylistListItem
              name={data.name}
              id={data.playlistId}
              selectPlaylist={this.props.selectPlaylist}
              key={data.playlistId}
            />
          );
        })}
      </div>
    );
  }
}

export default PlaylistList;

/*
{
                    this.props.playlists ?
                        this.props.playlists.map(data => {
                        return <PlaylistListItem name={data.name} id={data.playlistId} />
                    })
                        : console.log(this._reactInternalFiber._debugOwner.type.name)
                    
                }
                */
