import React from 'react';
import './Track.css';

class Track extends React.Component {
    constructor(props) {
        super(props);

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.previewTrack = this.previewTrack.bind(this);
    }
    
    renderAction () {
        if (this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>;
        } else {
            return <button className="Track-action" onClick={this.addTrack} >+</button>;
        }
    }
    addTrack () {
        this.props.onAdd(this.props.track)
    }
    removeTrack () {
        this.props.onRemove(this.props.track)
    }
    previewTrack() {
        if (!this.props.preview) {
            return;
        } else {
            return <audio controls src={this.props.preview} type="audio/ogg" >
            This format is not supported
           </audio>;
        }
    }
    render () {
        return ( <div className="Outer-track">
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} |  {this.props.track.album} </p>
                    
                </div>
                {this.renderAction()}
                
            </div>
            <div className="previewTrack">
                    {this.previewTrack()}
                </div>
            </div>
        )
    }
}

export default Track;