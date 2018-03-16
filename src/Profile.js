import React, { Component } from "react";
import axios from "./axios";
import App from "./App";
import ProfilePic from "./ProfilePic.js";
import ProfilePicUpload from "./ProfilePicUpload.js";
import Bio from "./Bio.js";
import BioEditor from "./BioEditor.js";

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ShowBioEditor: false
        };

        this.toggleBioModal = this.toggleBioModal.bind(this);
    }

    toggleBioModal() {
        this.setState({ showBioEditor: !this.state.showBioEditor });
    }

    render() {
        return (
            <div id="app__outer-box">
                <div id="app__cover-background" />
                <ProfilePic
                    toggleUploadModal={this.props.toggleUploadModal}
                    profilepic={this.props.profilepic}
                    first={this.props.first}
                    last={this.props.last}
                    setImage={this.props.setImage}
                />
                <div>
                    <h1>
                        {this.props.first} {this.props.last}
                    </h1>
                    <div>
                        {this.state.showBioEditor && (
                            <BioEditor
                                toggleBioModal={this.toggleBioModal}
                                setBio={this.props.setBio}
                            />
                        )}
                        {!this.state.showBioEditor && (
                            <Bio
                                bio={this.props.bio}
                                toggleBioModal={this.toggleBioModal}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

// Where to add this?
// {this.state.showUploadModal && (
//     <ProfilePicUpload
//         toggleUploadModal={this.toggleUploadModal}
//         setImage={this.setImage}
//     />
// )}
